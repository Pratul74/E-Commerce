FROM python:3.12.2 AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12.2-slim

WORKDIR /app

COPY --from=builder /install /usr/local/

COPY . .

EXPOSE "8000"

