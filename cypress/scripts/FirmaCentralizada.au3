; Script para hacer clic en un icono en la barra de tareas y luego hacer clic en la fima y click en guardar. 
Local $windowTitle = "Certificados" ; Reemplaza con el título de la ventana

; Activar la ventana por su título
WinActivate($windowTitle)

; Esperar a que la ventana esté activa
WinWaitActive($windowTitle)

; Me posiciono sobre la firma
Send("{TAB}")

;Selecciono la firma
Send("{SPACE}")

; Me posiciono sobre el seleccionar 
Send("{TAB}")

;Espero 5 segundos
Sleep(500)

;doy clic en el seleccionar
Send("{ENTER}")

Sleep(2000)