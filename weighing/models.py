from django.db import models
from datetime import datetime

# Create your models here.
class WeighBridge(models.Model):
    wgid = models.CharField(unique=True,max_length=20)
    location = models.CharField(max_length=50)
    added_by = models.CharField(max_length=100, default="Admin")
    wg_ver = models.CharField(max_length=50, default="0")
    wgReleaseDate = models.CharField(max_length=50, default="0")
    scada_ver = models.CharField(max_length=50, default="0")
    scadaReleaseDate = models.CharField(max_length=50, default="0")
    cloud_ver = models.CharField(max_length=50, default="0")
    cloudReleaseDate = models.CharField(max_length=50, default="0")
    date_joined = models.CharField(max_length=50, default="0")
    
    def __str__(self):
        return self.wgid

class wgidSettings(models.Model):
    wgid = models.ForeignKey(WeighBridge, on_delete=models.CASCADE,)
    heading1 = models.CharField(max_length=200, default="MBMH")
    heading2 = models.CharField(max_length=200, default="HO")
    heading3 = models.CharField(max_length=200, default="WAG9 UNV TESTING 5.9.0")
    stationName = models.CharField(max_length=100, default="MERIT")
    minNetWtForUL_Cal = models.FloatField(default=2.00)
    commodity = models.CharField(max_length=100, null=True)
    srcStation = models.CharField(max_length=100, null=True)
    tareWt_manual = models.BooleanField(default=True)
    overLoadExceed = models.FloatField(default=0.00)
    underLoadIfLess = models.FloatField(default=0.00)
    signature1 = models.CharField(null=True, max_length=200)
    signature2 = models.CharField(null=True, max_length=200)
    printSummary = models.BooleanField(default=True)
    printReportAuto = models.BooleanField(default=False)
    weighController = models.CharField(default="Remote ScoreBoard", max_length=100)


class TempRakeDetails(models.Model):
    rakeID = models.CharField(max_length=20)
    rakeName = models.CharField(max_length=20)
    fromStation = models.CharField(max_length=8)
    toStation = models.CharField(max_length=8)
    cnsg = models.CharField(max_length=8)
    cnsr = models.CharField(max_length=8)
    arrivalTime = models.DateTimeField()
    lineNo = models.CharField(max_length=10)
    leadLoco = models.CharField(max_length=12)
    wagonCount = models.IntegerField()
    wgid = models.CharField(max_length=20, default='')

class TempWagonDetails(models.Model):
    rakeID = models.ForeignKey(TempRakeDetails, on_delete=models.CASCADE,)
    wgseqNo = models.IntegerField()
    wgOwnRail = models.CharField(max_length=8)
    wgType = models.CharField(max_length=15)
    wgNumb = models.CharField(max_length=20)
    wgLEFlag = models.CharField(max_length=2)
    wgTare = models.FloatField()

class PermRakeDetails(models.Model):
    serialNo = models.IntegerField(default=0)
    rakeID = models.CharField(max_length=20)
    rakeName = models.CharField(max_length=20)
    fromStation = models.CharField(max_length=8)
    toStation = models.CharField(max_length=8)
    direction = models.CharField(max_length=10, null=True)
    commodity = models.CharField(max_length=50, null=True)
    cnsg = models.CharField(max_length=8)
    cnsr = models.CharField(max_length=8)
    arrivalTime = models.DateTimeField()
    lineNo = models.CharField(max_length=10)
    leadLoco = models.CharField(max_length=12)
    wagonCount = models.IntegerField()
    wgid = models.CharField(max_length=20)
    active = models.BooleanField(default=True)
    isUploaded = models.BooleanField(default=False)
    weightmentTime = models.DateTimeField(null=True)
    totalNetWt = models.FloatField(default=0.0)
    uploadTime = models.DateTimeField(null=True)
    billingLine1 = models.CharField(max_length=50, null=True)
    billingLine2 = models.CharField(max_length=50, null=True)
    billingLine3 = models.CharField(max_length=50, null=True)
    operatorName = models.CharField(max_length=50, null=True)

class PermWagonDetails(models.Model):
    rakeID = models.ForeignKey(PermRakeDetails, on_delete=models.CASCADE,)
    wgseqNo = models.IntegerField()
    wgOwnRail = models.CharField(max_length=8)
    wgType = models.CharField(max_length=15)
    wgNumb = models.CharField(max_length=20)
    wgLEFlag = models.CharField(max_length=2)
    wgTareWt = models.FloatField(default=0.0)
    grossWt = models.FloatField(default=0.0)
    noOfAxles = models.IntegerField(default=0)
    netWt = models.FloatField(default=0.0)
    speed = models.FloatField(default=0.0)
    WagonWeighingTime = models.DateTimeField(null=True)
    cc = models.FloatField(default=0.0)                 # Carrying Capacity
    pcc = models.FloatField(default=0.0)                # Permissible Carrying capacity