# Generated by Django 4.1.4 on 2023-01-25 13:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('weighing', '0004_temprakedetails_wgid'),
    ]

    operations = [
        migrations.CreateModel(
            name='PermRakeDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rakeID', models.CharField(max_length=20)),
                ('rakeName', models.CharField(max_length=20)),
                ('fromStation', models.CharField(max_length=8)),
                ('toStation', models.CharField(max_length=8)),
                ('cnsg', models.CharField(max_length=8)),
                ('cnsr', models.CharField(max_length=8)),
                ('arrivalTime', models.DateTimeField()),
                ('lineNo', models.CharField(max_length=10)),
                ('leadLoco', models.CharField(max_length=12)),
                ('wagonCount', models.IntegerField()),
                ('wgid', models.CharField(max_length=20)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='PermWagonDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wgseqNo', models.IntegerField()),
                ('wgOwnRail', models.CharField(max_length=8)),
                ('wgType', models.CharField(max_length=15)),
                ('wgNumb', models.CharField(max_length=20)),
                ('wgLEFlag', models.CharField(max_length=2)),
                ('wgTareWt', models.FloatField(default=0.0)),
                ('grossWt', models.FloatField(default=0.0)),
                ('moOfAxles', models.IntegerField(default=0)),
                ('netWt', models.FloatField(default=0.0)),
                ('speed', models.FloatField(default=0.0)),
                ('rakeID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weighing.temprakedetails')),
            ],
        ),
    ]
