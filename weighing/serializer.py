from .models import WeighBridge, TempRakeDetails, TempWagonDetails, PermWagonDetails, PermRakeDetails, wgidSettings
from rest_framework import serializers

class WeighBridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeighBridge
        fields = ('wgid', 'location', 'wg_ver', 'wgReleaseDate', 'scada_ver', 'scadaReleaseDate', 'cloud_ver', 'cloudReleaseDate')

class WeighBridgeSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = wgidSettings
        fields = ('heading1', 'heading2', 'heading3', 'stationName', 'minNetWtForUL_Cal', 'commodity', 'srcStation', 'tareWt_manual', 'overLoadExceed',
                   'underLoadIfLess', 'signature1', 'signature2', 'printSummary', 'printReportAuto', 'weighController')

class TempRakeIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempRakeDetails
        fields = ('rakeID', 'rakeName', 'arrivalTime')

class TempWagonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempWagonDetails
        fields = ('wgseqNo', 'wgType', 'wgNumb', 'wgTare')

class PermReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermRakeDetails
        fields = ('rakeID', 'weightmentTime', 'totalNetWt', 'wagonCount', 'isUploaded', 'commodity')

class PermRakeIDSerializer(serializers.ModelSerializer):
    # wagons = PermWagonSerializer(many=True)
    # wagons = serializers.PrimaryKeyRelatedField(
    #     many=True,
    #     read_only=False,
    #     queryset=PermWagonDetails.objects.all()
    # )
    class Meta:
        model = PermRakeDetails
        fields = ('rakeID', 'active', 'cnsg', 'wagonCount', 'weightmentTime', 'totalNetWt', 'serialNo', "toStation", "fromStation", "commodity", "leadLoco", "direction")

class PermWagonSerializer(serializers.ModelSerializer):
    rake = serializers.SlugRelatedField(
        many=True, 
        read_only=True,
        slug_field="rakeID"
    )
    class Meta:
        model = PermWagonDetails
        fields = ('rake', 'wgseqNo', 'wgType', 'wgNumb', 'wgTareWt', 'grossWt', 'noOfAxles', 'netWt', 'speed', 'wgOwnRail', 'WagonWeighingTime', 'cc', 'pcc')
