from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.permissions import AllowAny
from .models import WeighBridge, TempRakeDetails, TempWagonDetails, PermRakeDetails, PermWagonDetails, wgidSettings
from .serializer import WeighBridgeSerializer, TempRakeIDSerializer, TempWagonSerializer, PermWagonSerializer, PermReportSerializer, PermRakeIDSerializer, WeighBridgeSettingsSerializer
from rest_framework.response import Response
from .MeritPostRequestAndResponseParser import Merit_PostAndResponse
from datetime import datetime, date

import json

# Create your views here.

@csrf_exempt
def index(request):
    print(request.user)
    if request.user.is_authenticated:
        print("Authenticated")
        context = {} 
        return render(request, "index.html", context)
    else:
        return HttpResponseRedirect('/login/')

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def getRakeDetails(request):
    
    if request.method == 'POST':
        requestBody = json.loads(request.body.decode('utf-8'))
        print(request.body.decode('utf-8'))
        print(requestBody)
        username = requestBody['username']
        password = requestBody['password']
        wgid = requestBody['wgid']
        date_from_react = requestBody['date']
        url="http://10.60.200.54:50014/foisCustomer/FoisCustomerWS"
        location = WeighBridge.objects.values('location').filter(wgid=wgid)
        print(location[0])
        payload_to_send = {
            "REPORTNAME": "GETRAKEWGONDTLS",
            "WGBID":wgid,
            "WGMTSTTN": location[0]['location'],
            "STTNFROM": " ",
            "STTNTO": " ",
            "CNSR": " ",
            "CNSG": " ",
            "CMDT" : " ",
            "ARVLFROMTIME" : date_from_react,
            "ARVLTOTIME": date.today().strftime("%d-%m-%Y"),
            # "ARVLTOTIME": "25-11-2022",
            "strOprtId" : "WGMT"
        }
        json_payload = json.dumps(payload_to_send)
        print (type(json_payload))
        print (json_payload)
        xmlResponse = Merit_PostAndResponse("MBMH", username, password, json_payload, url)
        print (xmlResponse)
        TempRakeDetails.objects.filter(wgid = wgid).delete()

        # Calling parseRakeDetails functions to parse xml data from fois and add to db.
        parsestatus = parseRakeDetails(xmlResponse, wgid)
        if parsestatus == 'Success':
            print(location)
            #temprake = TempRakeDetails.objects.filter(fromStation = location[0]['location'])
            temprake = TempRakeDetails.objects.filter(wgid = wgid)
            testRake = TempRakeDetails.objects.filter(fromStation = "MAS")
            print(temprake | testRake)
            serializer = TempRakeIDSerializer(temprake | testRake, many=True)
            print(serializer.data)
        return Response(serializer.data)

    else :
        print(request.GET['rakeid'])
        rakeid = request.GET['rakeid']
        id = TempRakeDetails.objects.filter(rakeID = rakeid).values()[0]['id']
        tempwagondetails = TempWagonDetails.objects.filter(rakeID = id).values()
        serializer = TempWagonSerializer(tempwagondetails, many=True)
        print(serializer.data)
        return Response(serializer.data)

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def saveWeighedRakes(request):
    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            permRake = PermRakeDetails.objects.get(
                rakeID = requestBody['rake'],
                wgid = requestBody['wgid'],
            )
            
            totalNetWt = 0
            for wagon in requestBody['wagons']:
                print(wagon)
                direction = ""
                if wagon['direction'] == 1:
                    direction = "IN"
                elif wagon['direction'] == 2:
                    direction = "OUT"
                else:
                    direction = "Otherwise"
                try:
                    permWagon = PermWagonDetails.objects.get(
                        rakeID = permRake,
                        wgseqNo = wagon['id']
                    )
                    permWagon = PermWagonDetails.objects.filter(
                        rakeID = permRake,
                        wgseqNo = wagon['id']
                    ).update(
                        wgType = wagon['wagonType'],
                        wgNumb = wagon['wagonNo'],
                        grossWt = float(wagon['grossWt']),
                        noOfAxles = wagon['noOfAxles'],
                        netWt = float(wagon['netWt']),
                        speed = wagon['speed'],
                        WagonWeighingTime = wagon['endTime'],
                    )
                except PermWagonDetails.DoesNotExist:
                    print("DoesNot Exits")
                    PermWagonDetails(
                        rakeID = permRake,
                        wgseqNo = wagon['id'],
                        wgOwnRail = "",
                        wgType = wagon['wagonType'],
                        wgNumb = wagon['wagonNo'],
                        wgLEFlag = "",
                        wgTareWt = float(wagon['tareWt']),
                        grossWt = float(wagon['grossWt']),
                        noOfAxles = wagon['noOfAxles'],
                        netWt = float(wagon['netWt']),
                        speed = wagon['speed'],
                        WagonWeighingTime = wagon['endTime'],
                    ).save()
                
                totalNetWt = totalNetWt + float(wagon['netWt'])
            
            PermRakeDetails.objects.filter(
                rakeID = requestBody['rake'],
                wgid = requestBody['wgid'],
            ).update(
                active = False,
                totalNetWt = totalNetWt,
                direction = direction,
                weightmentTime = datetime.now(),
                wagonCount = len(requestBody['wagons'])
            )
            return HttpResponse("Terminated Successfully")
        except Exception as e:
            print(e)
            return HttpResponseBadRequest("Fail")
        

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def updateRakes(request):

    if request.method == 'POST':
        requestBody = json.loads(request.body.decode('utf-8'))
        print(requestBody)
        payload = requestBody['payload']
        try:
            PermRakeDetails.objects.filter(
                serialNo = requestBody['serialNo'],
                wgid = requestBody['wgid']
            ).update(
                commodity = payload['commodity'],
                fromStation = payload['srcStation'],
                toStation = payload['desStation'],
                cnsg = payload['consignee'],
                billingLine1 = payload['billingLine1'],
                billingLine2 = payload['billingLine2'],
                billingLine3 = payload['billingLine3'],
                leadLoco = payload['locoNumber'],
                
            )
            return Response("Updated Successfully")
        except Exception as e:
            return Response("Failed> Try Again")
    else:
        try:
            wgid = request.GET['wgid']
            serialNo = request.GET['serialNo']
            rake = request.GET['rake']
            try:
                if str(serialNo) == 'Latest':
                    # serialNo = PermRakeDetails.objects.filter(wgid=wgid).order_by('serialNo').last().serialNo
                    serialNo = PermRakeDetails.objects.filter(wgid=wgid, rakeID = rake).order_by('serialNo').last().serialNo
                else:
                    serialNo = int(serialNo) - 1
                permRake = PermRakeDetails.objects.filter(wgid=wgid, serialNo=serialNo).values()
                #rake = PermRakeDetails.objects.filter(wgid=wgid, active=True).values()[0]['rakeID']
                #activeWagonDetails = PermWagonDetails.objects.filter(rakeID = id).values()
                serializer = PermRakeIDSerializer(permRake, many=True)
                print(serializer.data)
                return Response(serializer.data)
            except PermRakeDetails.DoesNotExist:
                return HttpResponse("No Rakes available for weighBridge")
            except Exception as e:
                print (e)
                return HttpResponse("Fail")
        except Exception as e:
            print(e)
            return HttpResponse("Fail")

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def weighingRakes(request):
    
    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            rake = requestBody['rakeID']
            reverse = requestBody['reverse']
            wgid = requestBody['wgid']

            tempRake = TempRakeDetails.objects.filter(rakeID=rake).values()
            tempwagons = TempWagonDetails.objects.filter(rakeID=tempRake[0]['id']).values()
            try:
                PermRakeDetails.objects.filter(wgid=wgid, active=True).delete()
            except PermRakeDetails.DoesNotExist:
                pass
            except Exception as e:
                print (e)

            try:
                PermRakeDetails.objects.filter(rakeID=rake, wgid=wgid).delete()
            except PermRakeDetails.DoesNotExist:
                pass
            except Exception as e:
                print (e)
            
            try:
                data = PermRakeDetails.objects.filter(wgid=wgid)
                if len(data) == 0:
                    serialNo = 0
                else:
                    serialNo = data.order_by('serialNo').last().serialNo
                print(serialNo)
            except PermRakeDetails.DoesNotExist:
                serialNo = 0
            except AttributeError as e:
                print(e)
                serialNo = 0
            except Exception as e:
                print (e)

            permRake = PermRakeDetails(
                rakeID = tempRake[0]['rakeID'],
                rakeName = tempRake[0]['rakeName'],
                fromStation = tempRake[0]['fromStation'],
                toStation = tempRake[0]['toStation'],
                cnsg = tempRake[0]['cnsg'],
                cnsr = tempRake[0]['cnsr'],
                arrivalTime = tempRake[0]['arrivalTime'],
                lineNo = tempRake[0]['lineNo'],
                leadLoco = tempRake[0]['leadLoco'],
                wagonCount = tempRake[0]['wagonCount'],
                serialNo = serialNo + 1,
                wgid = wgid,
            )
            permRake.save()
            for j in range(0, int(tempRake[0]['wagonCount'])):
                try:
                    PermWagonDetails(
                        rakeID = permRake,
                        wgseqNo = tempwagons[j]['wgseqNo'],
                        wgOwnRail = tempwagons[j]['wgOwnRail'],
                        wgType = tempwagons[j]['wgType'],
                        wgNumb = tempwagons[j]['wgNumb'],
                        wgLEFlag = tempwagons[j]['wgLEFlag'],
                        wgTareWt = float(tempwagons[j]['wgTare']),
                    ).save()
                except Exception as e:
                    print(e)
            return HttpResponse("Rake Selected")
        except Exception as e:
            print(e)
            return HttpResponse("Please Try Again")
    else:
        try:
            wgid = request.GET['wgid']
            try:
                PermRakeDetails.objects.get(wgid=wgid, active=True)
                id = PermRakeDetails.objects.filter(wgid=wgid, active=True).values()[0]['id']
                rake = PermRakeDetails.objects.filter(wgid=wgid, active=True).values()[0]['rakeID']
                activeWagonDetails = PermWagonDetails.objects.filter(rakeID = id).values()
                serializer = PermWagonSerializer(activeWagonDetails, many=True)

                weighBridge = WeighBridge.objects.filter(wgid = wgid).values()
                weighBridgeSettings = wgidSettings.objects.filter(wgid=weighBridge[0]['id']).values()
                print(weighBridgeSettings)

                wgidserializer = WeighBridgeSettingsSerializer(weighBridgeSettings, many=True)
                print(wgidserializer.data)

                print({'rake' : rake, 'data' :serializer.data, 'wgidSettings': wgidserializer.data})
                return Response({'rake' : rake, 'data' :serializer.data, 'wgidSettings': wgidserializer.data})
            except PermRakeDetails.DoesNotExist:
                return HttpResponse("Rakes not selected for weighment")
            except Exception as e:
                print (e)
                return HttpResponse("Fail")
        except Exception as e:
            print(e)
            return HttpResponse("Fail")

#Function to parse rake details and inserting it to table
def parseRakeDetails(response, wgid):

    # Getting Rake Details and response status
    try:
        rakedetails = response['GETRAKEWGONDTLS']

        if rakedetails['TRANSACTIONSTTS'] == 'S':

            #Getting all rake details in rake-list Variable
            rake_list = rakedetails['RAKE']

            for i in range(0,int(rakedetails['ROWCONT'])):
                wagon = rake_list[i]['WGON']
                arrivalDateTime = datetime.strptime(rake_list[i]['ARVLTIME'], '%d-%m-%Y %H:%M')
                try:
                    cnsg_temp = " "
                    cnsr_temp = " "
                    leadLoco_temp = " "
                    fromStation_temp = " "
                    toStation_temp = " "
                    if rake_list[i]['CNSG'] != None:
                        cnsg_temp = rake_list[i]['CNSG']
                    
                    if rake_list[i]['CNSR'] != None:
                        cnsr_temp = rake_list[i]['CNSR']

                    if rake_list[i]['LEADLOCO'] != None:
                        leadLoco_temp = rake_list[i]['LEADLOCO']

                    if rake_list[i]['STTNFROM'] != None:
                        fromStation_temp = rake_list[i]['STTNFROM']

                    if rake_list[i]['STTNTO'] != None:
                        toStation_temp = rake_list[i]['STTNTO']
                    # TempRakeDetails.objects.all().delete()
                    tempRake = TempRakeDetails(
                        rakeID = rake_list[i]['RAKEID'],
                        rakeName = rake_list[i]['RAKENAME'],
                        fromStation = fromStation_temp,
                        toStation = toStation_temp,
                        cnsg = cnsg_temp,
                        cnsr = cnsr_temp,
                        arrivalTime = arrivalDateTime,
                        lineNo = rake_list[i]['LINENO'],
                        leadLoco = leadLoco_temp,
                        wagonCount = int(rake_list[i]['ACTLUNTS']),
                        wgid = wgid,
                    )
                    tempRake.save()
                except Exception as e:
                    print(e)
                
                for j in range(0, int(rake_list[i]['ACTLUNTS'])):
                    try:
                        TempWagonDetails(
                            rakeID = tempRake,
                            wgseqNo = wagon[j]['WGONSQNC'],
                            wgOwnRail = wagon[j]['WGONOWNGRLY'],
                            wgType = wagon[j]['WGONTYPE'],
                            wgNumb = wagon[j]['WGONNUMB'],
                            wgLEFlag = wagon[j]['WGONLEFLAG'],
                            wgTare = float(wagon[j]['WGONTARE']),
                        ).save()
                    except Exception as e:
                        print(e)
            return ("Success")
        else:
            return ("Failed")
    except Exception as e:
        print(e)


@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def saveEditedRakes(request):
    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            permRake = PermRakeDetails.objects.filter(
                rakeID = requestBody['rake'],
                wgid = requestBody['wgid'],
            )
            for wagon in requestBody['wagons']:
                permWagon = PermWagonDetails.objects.filter(
                    rakeID = permRake.values()[0]['id'],
                    wgseqNo = wagon['id']
                ).update(
                    wgOwnRail = wagon['wgOwnRail'],
                    wgType = wagon['wagonType'],
                    wgNumb = wagon['wagonNo'],
                    wgTareWt = wagon['tareWt'],
                    cc = wagon['carryingCapacity'],
                    pcc = wagon['permissibleCC'],
                )
            return HttpResponse("Saved Successfully")
        except Exception as e:
            print(e)
            return HttpResponseBadRequest("Fail")

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def editRakeDetails(request):
    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            rake = requestBody['rakeid']
            wgid = requestBody['wgid']

            # permRake = PermRakeDetails.objects.filter(rakeID=rake).values()
            # permwagons = PermWagonDetails.objects.filter(rakeID=permRake[0]['id']).values()

            id = PermRakeDetails.objects.filter(rakeID=rake).values()[0]['id']
            print(id)
            activeWagonDetails = PermWagonDetails.objects.filter(rakeID = id).values()
            
            serializer = PermWagonSerializer(activeWagonDetails, many=True)
            print(serializer.data)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return
    else:
        try:
            wgid = request.GET['wgid']
            print(wgid)
            permRake = PermRakeDetails.objects.filter(wgid=wgid).values().order_by('serialNo')[:200:-1]
            serializer = PermRakeIDSerializer(permRake, many=True)
            print(serializer.data)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return HttpResponse("Fail") 

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def rakeReport(request):

    if request.method == 'POST':
        # do Something
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            rake = requestBody['rake']
            username = requestBody['username']
            password = requestBody['password']
            wgid = requestBody['wgid']
            #url="https://www.foistest.indianrail.gov.in/foisCustomer/FoisCustomerWS"
            url="http://10.60.200.54:50014/foisCustomer/FoisCustomerWS"
            location = WeighBridge.objects.values('location').filter(wgid=wgid)
            print(location[0])
            # for rake in rakes:
            permRake = PermRakeDetails.objects.filter(rakeID=rake).values()
            permWagon = PermWagonDetails.objects.filter(rakeID=permRake[0]['id']).values()
            seqNo=[]
            wgnOwn=[]
            wgType=[]
            wgNumb=[]
            grossWt=[]
            for wagon in permWagon:
                seqNo.append(str(wagon['wgseqNo']))
                wgnOwn.append(wagon['wgOwnRail'])
                wgType.append(wagon['wgType'])
                wgNumb.append(wagon['wgNumb'])
                grossWt.append(str(wagon['grossWt']))
            startTime = permWagon[0]['WagonWeighingTime']
            endTime = permWagon[len(permWagon) - 1]['WagonWeighingTime']
            payload_to_send = {
                "REPORTNAME": "SAVEINMTNWGMTDTLS",
                "WGMTSTTN": location[0]['location'],
                "WGBID":wgid,
                # "STARTTIME": "15-09-2012 10:00",
                # "ENDTIME": "15-09-2012 21:00",
                "STARTTIME": datetime.strftime(startTime, "%d-%m-%Y %H:%M"),
                "ENDTIME": datetime.strftime(endTime, "%d-%m-%Y %H:%M"),
                "VLIDFLAG" : "Y",
                "RAKEID": permRake[0]['rakeID'],
                "STTNFROM": permRake[0]['fromStation'],
                "STTNTO": permRake[0]['toStation'],
                "CNSR": permRake[0]['cnsg'],
                "CNSG": permRake[0]['cnsr'],
                "LEADLOCO" : permRake[0]['leadLoco'],
                "ROWCONT": str(len(permWagon)),
                "SQNCNUMB" : seqNo,
                "WGONOWNGRLY": wgnOwn,
                "WGONTYPE": wgType,
                "WGONNUMB" : wgNumb,
                "GROSWGHT": grossWt,
                "strOprtID" : "WGMT",
            }
            print(payload_to_send)
            json_payload = json.dumps(payload_to_send)
            print (json_payload)
            xmlResponse = Merit_PostAndResponse("MBMH", username, password, json_payload, url)
            print (xmlResponse)
            #{'SAVEINMTNWGMTDTLS': {'TransactionStts': 'S', 'ErrorMsg': 'Success'}}
            status = xmlResponse['SAVEINMTNWGMTDTLS']['TransactionStts']
            if status == "S":
                permRake = PermRakeDetails.objects.filter(rakeID=rake).update(isUploaded=True)
            else:
                status = xmlResponse['SAVEINMTNWGMTDTLS']['ErrorMsg']
            return HttpResponse(status)
        except Exception as e:
            print(e)
            return HttpResponseBadRequest("TryAgain")
    else :
        try:
            wgid = request.GET['wgid']
            print(wgid)
            permRake = PermRakeDetails.objects.filter(wgid=wgid, active=False).values().order_by('serialNo')[:200:-1]
            consignee = PermRakeDetails.objects.all().values_list('cnsg').distinct()
            cnsg_list = []
            for cnsg in consignee:
                cnsg_list.append(cnsg[0])
            cnsg_list.append("ALL")
            serializer = PermReportSerializer(permRake, many=True)
            print(serializer.data)
            
            weighBridgeDetails = WeighBridge.objects.get(wgid = wgid)
            wgidSettingsDetails = wgidSettings.objects.filter(wgid = weighBridgeDetails)
            commodity = wgidSettingsDetails.values()[0]['commodity']
            return Response({ 'data': serializer.data, 'cnsg': cnsg_list , 'commodity': commodity})
        except Exception as e:
            print(e)
            return HttpResponse("Fail")
    return

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def printReport(request):
    if request.method == 'GET':
        # do Something
        try:
            wgid = request.GET['wgid']
            rake = request.GET['rake']
            try:
                # PermRakeDetails.objects.get(wgid=wgid, active=True)
                id = PermRakeDetails.objects.filter(wgid=wgid, rakeID=rake).values()
                permSerializer = PermRakeIDSerializer(id, many=True)
                print(permSerializer.data)
                # rake = PermRakeDetails.objects.filter(wgid=wgid, active=True).values()[0]['rakeID']
                wagonDetails = PermWagonDetails.objects.filter(rakeID = id[0]['id']).values()
                wagonserializer = PermWagonSerializer(wagonDetails, many=True)
                print(wagonserializer.data)

                weighBridgeDetails = WeighBridge.objects.get(wgid = wgid)
                wgidSettingsDetails = wgidSettings.objects.filter(wgid = weighBridgeDetails)
                wgidSerializer = WeighBridgeSettingsSerializer(wgidSettingsDetails, many=True)
                print(wgidSerializer.data)

                # return Response({'rake' : rake, 'data' :serializer.data})
                return Response({ "Rake" : permSerializer.data, "Wagon":wagonserializer.data, "WGID": wgidSerializer.data })
            except PermRakeDetails.DoesNotExist:
                return HttpResponse("")
            except Exception as e:
                print (e)
                return HttpResponse("Fail")
        except Exception as e:
            print (e)
            return HttpResponse("Fail")

@csrf_exempt
@api_view(('POST', 'GET'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def printSummaryReport(request):
    if request.method == 'GET':
        # do Something
        try:
            wgid = request.GET['wgid']
            fromDate = request.GET['fromDate']
            tillDate = request.GET['tillDate']
            reportType = request.GET['reportType']
            consignee = request.GET['consignee']
            print(reportType)
            try:
                rakerange = ""
                # DateWise Detailed Report
                if reportType == 'DWDR':
                    rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate)).order_by('weightmentTime').values()
                    print (rakerange)
                elif reportType == 'DWSR':              # DateWise Summary Report
                    rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate)).order_by('weightmentTime').values()
                    print (rakerange)
                elif reportType == 'DCWR':              # Date & ConsigneeWise Report
                    if consignee == "ALL":
                        rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate)).order_by('weightmentTime').values()
                    else:
                        rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate), cnsg=consignee).order_by('weightmentTime').values()
                    print (rakerange)
                elif reportType == 'CWDWR':             # ConsigneeWise & DateWise Report
                    if consignee == "ALL":
                        rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate)).order_by('cnsg').values()
                    else:
                        rakerange = PermRakeDetails.objects.filter(wgid=wgid, weightmentTime__range=(fromDate, tillDate), cnsg=consignee).order_by('cnsg').values()
                    print (rakerange)
                
                weighBridgeDetails = WeighBridge.objects.get(wgid = wgid)
                wgidSettingsDetails = wgidSettings.objects.filter(wgid = weighBridgeDetails)
                wgidSerializer = WeighBridgeSettingsSerializer(wgidSettingsDetails, many=True)
                print(wgidSerializer.data)
                
                serializer = PermRakeIDSerializer(rakerange, many=True)
                print(serializer.data)
                return Response({ "Rake" : serializer.data, "WGID": wgidSerializer.data })
                #return Response("Success")
            except PermRakeDetails.DoesNotExist:
                return HttpResponse("")
            except Exception as e:
                print (e)
                return HttpResponse("Fail")
        except Exception as e:
            print (e)

@csrf_exempt
def user_login(request):

    context = {}

    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        requestBody = json.loads(request.body.decode('utf-8'))
        print(request.body.decode('utf-8'))
        print(requestBody)
        # Gather the username and password provided by the user.
        # This information is obtained from the login form.
        username = requestBody['username']
        password = requestBody['password']

        # Use Django's machinery to attempt to see if the username/password
        # combination is valid - a User object is returned if it is.
        user = authenticate(request, username=username, password=password)

        # If we have a User object, the details are correct.
        # If None (Python's way of representing the absence of a value), no user
        # with matching credentials was found.
        if user is not None:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # We'll send the user back to the homepage.
                login(request, user)
                return HttpResponse("Success")
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your account is disabled")
        else:
            # Bad login details were provided. So we can't log the user in.
            print ("Invalid login details: {0}, {1}".format(username, password))
            return HttpResponse("Invalid login details")

    # The request is not a HTTP POST, so display the login form.
    # This scenario would most likely be a HTTP GET.
    else:
        # No context variables to pass to the template system, hence the
        # blank dictionary object...
        return render(request, "index.html", context)

@csrf_exempt
def logout_view(request):
    logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect('/login/')

@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
# @permission_classes((AllowAny))
def getwgid(request):
    wgids = WeighBridge.objects.all()
    serializer = WeighBridgeSerializer(wgids, many=True)
    print(serializer.data)
    return Response(serializer.data)

@api_view(('GET', 'POST'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
# @permission_classes((AllowAny))
def getwgidSettings(request):

    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            settings = requestBody['settings']
            wgid = requestBody['wgid']
            print(settings["heading1"], wgid)

            weighBridge = WeighBridge.objects.get(wgid = wgid)
            try:
                wgidSettings.objects.get(wgid = weighBridge)
                wgidSet = wgidSettings.objects.filter(wgid = weighBridge).update(
                    # wgid = weighBridge,
                    heading1 = settings['heading1'],
                    heading2 = settings['heading2'],
                    heading3 = settings['heading3'],
                    stationName = settings['stationName'],
                    minNetWtForUL_Cal = settings['minNetWtForUL_Cal'],
                    commodity = settings['commodity'],
                    srcStation = settings['srcStation'],
                    tareWt_manual = settings['tareWt_manual'],
                    overLoadExceed = settings['overLoadExceed'],
                    underLoadIfLess = settings['underLoadIfLess'],
                    signature1 = settings['signature1'],
                    signature2 = settings['signature2'],
                    printSummary = settings['printSummary'],
                    printReportAuto = settings['printReportAuto'],
                    weighController = settings['weighController'],
                )
            except wgidSettings.DoesNotExist:
                print("New Entry")
                wgidSet = wgidSettings(
                    wgid = weighBridge,
                    heading1 = settings['heading1'],
                    heading2 = settings['heading2'],
                    heading3 = settings['heading3'],
                    stationName = settings['stationName'],
                    minNetWtForUL_Cal = settings['minNetWtForUL_Cal'],
                    commodity = settings['commodity'],
                    srcStation = settings['srcStation'],
                    tareWt_manual = settings['tareWt_manual'],
                    overLoadExceed = settings['overLoadExceed'],
                    underLoadIfLess = settings['underLoadIfLess'],
                    signature1 = settings['signature1'],
                    signature2 = settings['signature2'],
                    printSummary = settings['printSummary'],
                    printReportAuto = settings['printReportAuto'],
                    weighController = settings['weighController'],
                )
                wgidSet.save()
            except Exception as e:
                print(e)
            return Response("Success")
        except Exception as e:
            print (e)
            return Response("Fail")
    else:
        wgid = request.GET['wgid']
        weighBridge = WeighBridge.objects.filter(wgid = wgid).values()
        weighBridgeSettings = wgidSettings.objects.filter(wgid=weighBridge[0]['id']).values()
        print(weighBridgeSettings)

        serializer = WeighBridgeSettingsSerializer(weighBridgeSettings, many=True)
        print(serializer.data)
        return Response(serializer.data)
    

@api_view(('GET', 'POST'))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
# @permission_classes((AllowAny))
def version(request):

    if request.method == 'POST':
        try:
            requestBody = json.loads(request.body.decode('utf-8'))
            print(requestBody)
            TLC_FirmwareVersion = requestBody['TLC_FirmwareVersion ']
            TLC_FirmwareReleaseDate = requestBody['TLC_FirmwareReleaseDate']
            TLC_PyCodeVersion = requestBody['TLC_PyCodeVersion ']
            TLC_PyCodeReleaseDate = requestBody['TLC_PyCodeReleaseDate']
            cloudVersion = "V1.1.10"
            cloudVersionReleaseDate = "1st November 2023"
            WeighBridge.objects.filter(
                wgid = "MBMAGH01"
                ).update(
                    wg_ver = TLC_FirmwareVersion,
                    wgReleaseDate = TLC_FirmwareReleaseDate,
                    scada_ver = TLC_PyCodeVersion,
                    scadaReleaseDate = TLC_PyCodeReleaseDate,
                    cloud_ver = cloudVersion,
                    cloudReleaseDate = cloudVersionReleaseDate
                )
            return HttpResponse("Success")
        except Exception as e:
            return HttpResponse("Fail")
    else:
        wgid = request.GET['wgid']
        weighBridge = WeighBridge.objects.filter(wgid = wgid).values()
        print(weighBridge)
        serializer = WeighBridgeSerializer(weighBridge, many=True)
        print(serializer.data)
        return Response(serializer.data)