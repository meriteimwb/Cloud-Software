# Generated by Django 4.1.4 on 2023-01-27 04:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weighing', '0005_permrakedetails_permwagondetails'),
    ]

    operations = [
        migrations.AddField(
            model_name='permrakedetails',
            name='isUploaded',
            field=models.BooleanField(default=False),
        ),
    ]
