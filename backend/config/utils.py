from rest_framework.response import Response

def success_response(data, message="Success"):
    return Response({
        "status": "success",
        "message": message,
        "data": data
    })

def error_response(message, errors=None, status_code=400):
    return Response({
        "status": "error",
        "message": message,
        "errors": errors
    }, status=status_code)