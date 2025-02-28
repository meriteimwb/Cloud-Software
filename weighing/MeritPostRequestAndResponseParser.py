#Filename : MeritXMLParse.py
#Description : Python Program to post xml data and parse xml data 
#Version : 1.0.4
#Date : Jan 2022
#Author : Meimurugan Krishna

#***********************************************************************************#
#*************** Import Libraries **************************************************#
#***********************************************************************************#
import xmltodict
import requests
from dict2xml import dict2xml
import json

#***********************************************************************************#
#*************** File Variables ****************************************************#
#***********************************************************************************#
filedata = None
url = 'https://www.foistest.indianrail.gov.in/foisCustomer/FoisCustomerWS'
contentType = 'text/xml; charset=utf-8'
PostSuccessCode = 200
XMLIdString = '<?xml'
InputListSize = 4
parametercount = 0
GetRakeDict = {"WGBID":" ", "WGMTSTTN": " ", "STTNFROM": " ", "STTNTO": " ","CNSR": " ", "CNSG": " ", "CMDT" : " ", 
			"ARVLFROMTIME" : " ", "ARVLTOTIME": " ", "strOprtId" : " "}
SaveWagonDict = {"WGMTSTTN": " ", "WGBID" : " ", "STARTTIME": " ", "ENDTIME":" ", "VLIDFLAG" : " ",
			"RAKEID": " ", "STTNFROM": " ", "STTNTO": " ",	"CNSR": " ", "CNSG": " ", "LEADLOCO" : " ", "ROWCONT" : " ","strOprtId" : " "}
WGMTDict = {"SQNCNUMB": [], "WGONOWNGRLY": [], "WGONTYPE": [], "WGONNUMB" : [], "GROSWGHT": []}
			
MeritXMLTemplate = '''
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservices.fois.cris/">
   <soapenv:Header/>
   <soapenv:Body>
      <web:processRequest>
         <arg0>{arg0}</arg0>
         <arg1>{arg1}</arg1>
         <arg2>{arg2}</arg2>
         <arg3>
         <![CDATA[
			{arg3}
            ]]>
         </arg3>
      </web:processRequest>
   </soapenv:Body>
</soapenv:Envelope>'''

#***********************************************************************************#
#******************************* Functions *****************************************#
#***********************************************************************************#
#********************************************************************************************#
#Description : function for iterating the response dict
#Arguments : input dictionary
#Return : list
#********************************************************************************************#
def Merit_GetInputXMLString(inputDict):
	parametercount = 0
	OutputString = ""			
	OutputString = "<REPORTNAME>"
	
	if(inputDict['REPORTNAME'] == 'GETRAKEWGONDTLS'):
		OutputString = OutputString + str(inputDict["REPORTNAME"])+"\n"
		for k, v in GetRakeDict.items():
			data = " "
			if k in inputDict.keys():
				data = inputDict[k]
			OutputString = OutputString + "<PARAMETER>"+ str(parametercount) + "<NAME>" + k + "</NAME><TYPE>STRING</TYPE><VALUE><VALUE1>"+ data + "</VALUE1></VALUE></PARAMETER>"+"\n"
			parametercount = parametercount + 1
	elif(inputDict['REPORTNAME'] == 'SAVEINMTNWGMTDTLS'):
		print("Save DIctionary INPUT")
		OutputString = OutputString + str(inputDict["REPORTNAME"])+"\n"
		for k, v in SaveWagonDict.items():
			data = " "
			if k in inputDict.keys():
				data = inputDict[k]
			if(k == "ROWCONT"):
				OutputString = OutputString + "<PARAMETER>"+ str(parametercount) + "<NAME>" + k + "</NAME><TYPE>STRING</TYPE><VALUE><VALUE1>"+ data + "</VALUE1></VALUE></PARAMETER>"+"\n"
				parametercount = parametercount + 1
				datacount = int(data)
				if(datacount > 0):
					for k, v in WGMTDict.items():
						count = 0
						OutputString = OutputString + "<PARAMETER>"+ str(parametercount) + "<NAME>" + k + "</NAME><TYPE>STRING[]</TYPE><VALUE>"
						for count in range(datacount):
							data = " "
							if k in inputDict.keys():
								if(len(inputDict[k]) == datacount):
									dataList = list(inputDict[k])
									data = dataList[count]
									OutputString = OutputString +"<VALUE"+ str(count + 1) +">"+ data + "</VALUE"+str(count + 1) +">"
						parametercount = parametercount + 1
						OutputString = OutputString + "</VALUE></PARAMETER>"+"\n"
				break
			OutputString = OutputString + "<PARAMETER>"+ str(parametercount) + "<NAME>" + k + "</NAME><TYPE>STRING</TYPE><VALUE><VALUE1>"+ data + "</VALUE1></VALUE></PARAMETER>"+"\n"
			parametercount = parametercount + 1
		data = " "
		if "strOprtID" in inputDict.keys():
			data = inputDict["strOprtID"]
		OutputString = OutputString + "<PARAMETER>"+ str(parametercount) + "<NAME>" + "strOprtID" + "</NAME><TYPE>STRING</TYPE><VALUE><VALUE1>"+ data + "</VALUE1></VALUE></PARAMETER>"+"\n"
			
	elif(inputDict['REPORTNAME'] == 'GETSYSTIME'):
		OutputString = OutputString + str(inputDict["REPORTNAME"])+"\n"
		data = " "
		if "strOprtID" in inputDict.keys():
			data = inputDict["strOprtID"]
		OutputString = OutputString + "<PARAMETER>0<NAME>strOprtID</NAME><TYPE>STRING</TYPE><VALUE><VALUE1>"+ data + "</VALUE1></VALUE></PARAMETER>"+"\n"
	
	OutputString = OutputString + "</REPORTNAME>"			
	return OutputString

#********************************************************************************************#
#Description : function to get the XML Input data format from the given input list
#Arguments : inputList
#Return : XML String
#********************************************************************************************#	
def Merit_GetDataFormat(org, username, password, data):
	XMLString = MeritXMLTemplate
	XMLString = XMLString.replace("{arg0}", org, 1)
	XMLString = XMLString.replace("{arg1}", username, 1)
	XMLString = XMLString.replace("{arg2}", password, 1)
	jsondata = json.loads(data)
	inputXML = Merit_GetInputXMLString(jsondata)
	XMLString = XMLString.replace("{arg3}", inputXML, 1)
	return XMLString	
	
#********************************************************************************************#
#Description : function for iterating the response dict
#Arguments : input dictionary
#Return : list
#********************************************************************************************#
def Merit_RecursiveItems(dictionary):
	outputDict = {}
	for key, value in dictionary.items():
		if type(value) is dict:
			if(key == 'return'):
				return value
			if(len(outputDict) == 0):
				outputDict = Merit_RecursiveItems(value)
	
	if(len(outputDict) == 0):
		outputDict["ErrorCode"] = PostSuccessCode
				
	return outputDict
			
#********************************************************************************************#
#Description : function for iterating the response dict
#Arguments : input dictionary
#Return : list
#********************************************************************************************#	
def Merit_PostAndResponse(org, username, password, data, url):
	outputDict = {}
	if((org != "") and (username != "") and (password != "") and (url != "") and (data != "")) :
		inputdata = Merit_GetDataFormat(org, username, password, data)
		print("input ", inputdata)
		res = requests.post(url, headers = {'Content-Type': contentType}, data = inputdata)
		outputDict["ErrorCode"] = res.status_code
		if(res.status_code == PostSuccessCode):
			ModifiedString = res.text.replace("&lt;", "<").rstrip().lstrip().strip()
			ModifiedString = ModifiedString.replace("&gt;", ">")
			#print(ModifiedString)
			if(ModifiedString.__contains__(XMLIdString)):
				DataDict = xmltodict.parse(ModifiedString)
				outputDict = Merit_RecursiveItems(DataDict)
	return outputDict


	
#******************************************** Test *******************************************#	 
RakeDict = '''{"REPORTNAME": "GETRAKEWGONDTLS", "WGBID":"MBCGL 01", "WGMTSTTN": "CGL", "STTNFROM": " ", "STTNTO": " ","CNSR": " ", "CNSG": " ", "CMDT" : " ", 
			"ARVLFROMTIME" : "24-11-2022", "ARVLTOTIME": "25-11-2022", "strOprtId" : "WGMT"}'''
TimeDict = '''{"REPORTNAME": "GETSYSTIME", "strOprtID":"WGMT"}'''	
SaveDict = '''{"REPORTNAME": "SAVEINMTNWGMTDTLS", "WGMTSTTN": "CGL", "WGBID" : "MBCGL 01", "STARTTIME": "24-11-2022 12:10", "ENDTIME":"24-11-2022 21:40", 
			"VLIDFLAG" : "Y", "RAKEID": "CGL 241122124859", "STTNFROM": "CGL", "STTNTO": "MYP",	"CNSR": "ACCB", "CNSG": "ACCB", "LEADLOCO" : "#", "ROWCONT" : "2", 
			"SQNCNUMB" : ["1","2"], "WGONOWNGRLY": ["WC", "WC"], "WGONTYPE": ["BOXNM1", "BOXNM1"], "WGONNUMB" : ["23330000502", "23330000503"], 
			"GROSWGHT": ["22.53", "22.53"], "strOprtID" : "WGMT"}'''

SaveDict1 = '''{"REPORTNAME": "SAVEINMTNWGMTDTLS", "WGMTSTTN": "MAGH", "WGBID": "MBMAGH01", "STARTTIME": "15-09-2012 10:00", "ENDTIME": "15-09-2012 21:00", 
			"VLIDFLAG": "Y", "RAKEID": "00762", "STTNFROM": "NZM", "STTNTO": "RU", "CNSR": "ACCB", "CNSG": "ACCB", "LEADLOCO": "#", "ROWCONT": "10", 
			"SQNCNUMB": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], "WGONOWNGRLY": ["SCR", "IR", "IR", "IR", "IR", "IR", "IR", "IR", "IR", "IR"], 
			"WGONTYPE": ["VPH", "VVN", "VVN", "VVN", "VVN", "VVN", "VVN", "VVN", "VVN", "VVN"], 
			"WGONNUMB": ["117826", "8773", "91125", "8771", "8983", "90103", "91124", "91130", "91131", "91132"], 
			"GROSWGHT": ["98.0", "86.0", "82.0", "42.0", "76.0", "98.0", "84.0", "80.0", "42.0", "76.0"], "strOprtID": "WGMT"}'''

#9print(Merit_PostAndResponse("MBMH","MBMH@CRIS", "cris@123", SaveDict1, url))	