from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from django.core.cache import cache
import hashlib

from .models import Product
from .serializers import ProductSerializer
from .permissions import IsAdminOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['price', 'stock']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def get_serializer_context(self):
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        key = f"products:{request.get_full_path()}"
        cache_key = hashlib.md5(key.encode()).hexdigest()

        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)

        cache.set(cache_key, response.data, timeout=60)

        return response

    
    def retrieve(self, request, *args, **kwargs):
        product_id = kwargs.get("pk")
        cache_key = f"product:{product_id}"

        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        
        response = super().retrieve(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=60)

        return response

    def perform_create(self, serializer):
        serializer.save()
        cache.clear() 

    def perform_update(self, serializer):
        serializer.save()
        cache.clear()

    def perform_destroy(self, instance):
        instance.delete()
        cache.clear()

