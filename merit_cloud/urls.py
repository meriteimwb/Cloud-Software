"""merit_cloud URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from weighing import views
from rest_framework.authtoken import views as rest_View

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="index"),
    path("login/", views.user_login),
    path("rake/", views.index),
    path("print/report/", views.printReport),
    path("print/summaryreport/", views.printSummaryReport),
    # path("rake/edit/", views.index),
    path("rake/download/", views.index),
    path("Weighment/", views.index),
    path("report/", views.index),
    path("settings/", views.index),
    path("rakes/report/", views.rakeReport),
    path("system/", views.index),
    path("version/", views.version),
    path("getwgid/", views.getwgid),
    path("wgidsettings/", views.getwgidSettings),
    path("logout/", views.logout_view),
    path("getrakedetails/", views.getRakeDetails),
    path("weighing/rakes/", views.weighingRakes),
    path("rake/edit/details/", views.editRakeDetails),
    path("rake/edit/save/", views.saveEditedRakes),
    path("weighing/rakes/save/", views.saveWeighedRakes),
    path("update/rakeData/", views.updateRakes),
    path('api-token-auth/', rest_View.obtain_auth_token),
]
