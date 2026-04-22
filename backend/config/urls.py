from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view()),

    path('api/v1/auth/', include('accounts.urls')),

    path('api/v1/products/', include('products.urls')),
]