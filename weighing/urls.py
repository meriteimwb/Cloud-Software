from django.urls import path

from weighing import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.index, name="login"),
    path("/weighing/rake/", views.index, name="login"),
    path("/weighing/rake/edit/", views.index, name="login"),
    path("/weighing/rake/download/", views.index, name="login"),
    path("/weighing/Weighment/", views.index, name="login"),
    path("/weighing/report/", views.index, name="login"),
    path("/weighing/system/", views.index, name="login"),
]