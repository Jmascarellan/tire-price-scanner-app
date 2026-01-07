# tire-price-scanner-app

Aplicación móvil capaz de automatizar la realización de presupuestos para la venta y montaje de neumático apoyado con herramientas de Inteligencia Artificial. La app puede detectar la medida y mediante flujos de automatización desarrollados en n8n, se consultan en tiempo real los precios de neumáticos disponibles en web dedicada.



\# Tire Price Scanner App



Aplicación móvil para escanear la medida de neumáticos y generar presupuestos en tiempo real a partir de precios actualizados desde la web \*\*muchoneumatico.com\*\*, utilizando inteligencia artificial y automatizaciones low-code.



---



\## 🚗 ¿Qué hace esta app?



\- Toma una foto del neumático (desde cámara o galería)

\- Detecta automáticamente la medida del neumático (ej. `205/55 R16 91V`)

\- Busca precios reales usando scraping con Apify

\- Muestra un listado por marcas y permite filtrar resultados

\- Permite generar y exportar un presupuesto visual

\- Alternativamente, acepta la medida ingresada manualmente



---



\## 🧠 Tecnologías utilizadas



\- \*\*React Native con Expo\*\* — App móvil multiplataforma

\- \*\*n8n\*\* — Automatizaciones y orquestación de flujos

\- \*\*ChatGPT (OCR + LLM)\*\* — Análisis y validación de texto desde imágenes

\- \*\*Apify\*\* — Web scraping de precios de neumáticos

\- \*\*MongoDB\*\* — Para gestión de datos temporales (solo configuración, sin persistencia en esta versión)

\- \*\*Railway\*\* — Despliegue cloud de los flujos n8n



---



\## 📦 Estructura del proyecto



/app

|\_ (tabs)/ # Navegación por pestañas

|\_ components/ # Botones, resultados, previews

|\_ assets/ # Imágenes, íconos

.env # Variables de entorno (no incluida en el repo)

.gitignore # Exclusiones (seguridad y rendimiento)



\## 📖 Proyecto desarrollado como TFM



Este proyecto fue desarrollado como Trabajo Final para la obtención del título de \*\*Especialista en Inteligencia Artificial\*\* en Racks Labs.



\*\*Autor\*\*: Jose Pedro Mascarell Anaya  

\*\*Año\*\*: 2025  

\*\*Modalidad\*\*: Proyecto Técnico de IA





