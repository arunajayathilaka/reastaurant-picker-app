FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY /dist/restaurant-picker-app/browser /usr/share/nginx/html

EXPOSE 80