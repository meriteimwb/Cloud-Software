# Generated by Django 4.1.4 on 2023-09-04 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weighing', '0010_permrakedetails_commodity_permrakedetails_direction_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permwagondetails',
            name='WagonWeighingTime',
            field=models.DateTimeField(),
        ),
    ]
