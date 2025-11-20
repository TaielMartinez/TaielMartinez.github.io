/* ===== LÓGICA DE JUEGO COMPARTIDA ===== */

class GameEngine {
    constructor(config) {
        this.items = config.items; // Array de preguntas (logos, sneakers, etc.)
        this.imageElementId = config.imageElementId; // ID del elemento img
        this.imageRespuestaId = config.imageRespuestaId || null; // ID del elemento img de respuesta
        this.optionsContainerId = config.optionsContainerId; // ID del contenedor de opciones
        this.livesElementIds = config.livesElementIds; // Array con IDs de los corazones
        this.popupId = config.popupId; // ID del popup
        this.onComplete = config.onComplete || null; // Callback cuando se completa
        this.onGameOver = config.onGameOver || null; // Callback cuando se pierde
        
        this.currentIndex = 0;
        this.lives = 2;
        this.isVerifying = false; // Prevenir múltiples clics
    }

    init() {
        this.currentIndex = 0;
        this.lives = 2;
        this.isVerifying = false;
        this.resetLives();
        this.loadQuestion();
    }

    resetLives() {
        this.livesElementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.src = "assets/icons/corazon_rojo.png";
            }
        });
    }

    loadQuestion() {
        if (this.currentIndex >= this.items.length) {
            this.complete();
            return;
        }

        const item = this.items[this.currentIndex];
        const imageElement = document.getElementById(this.imageElementId);
        const optionsContainer = document.getElementById(this.optionsContainerId);

        if (imageElement) {
            // Resetear y cargar imagen deformada
            imageElement.style.opacity = "1";
            imageElement.style.transition = "opacity 1s ease-in-out";
            imageElement.src = item.imagen;
            
            // Ocultar imagen de respuesta si existe
            if (this.imageRespuestaId) {
                const respuestaElement = document.getElementById(this.imageRespuestaId);
                if (respuestaElement) {
                    respuestaElement.style.display = "none";
                    respuestaElement.style.opacity = "0";
                    respuestaElement.src = "";
                }
            }
        }

        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            
            // Mezclar opciones para que no siempre esté la correcta en la misma posición
            const shuffledOptions = [...item.opciones].sort(() => Math.random() - 0.5);
            
            shuffledOptions.forEach(opcion => {
                const btn = document.createElement("button");
                btn.className = "opcion";
                btn.innerText = opcion;
                btn.onclick = () => this.verify(opcion, btn);
                optionsContainer.appendChild(btn);
            });
        }
    }

    verify(selected, btn) {
        if (this.isVerifying) return; // Prevenir múltiples clics
        this.isVerifying = true;

        const correct = this.items[this.currentIndex].correcta;
        const isCorrect = selected === correct;

        if (isCorrect) {
            // Respuesta correcta
            btn.style.backgroundColor = "#2ecc71";
            btn.style.color = "white";

            // Animar crossfade de imagen si existe imagenRespuesta
            const item = this.items[this.currentIndex];
            const imageElement = document.getElementById(this.imageElementId);
            
            if (imageElement && item.imagenRespuesta && this.imageRespuestaId) {
                const respuestaElement = document.getElementById(this.imageRespuestaId);
                
                if (respuestaElement) {
                    // Pre-cargar la imagen de respuesta
                    respuestaElement.src = item.imagenRespuesta;
                    respuestaElement.style.display = "block";
                    respuestaElement.style.transition = "opacity 1s ease-in-out";
                    respuestaElement.style.opacity = "0";
                    
                    // Pequeño delay para asegurar que la imagen se carga
                    setTimeout(() => {
                        // Crossfade: fade out de la deformada y fade in de la respuesta simultáneamente
                        imageElement.style.transition = "opacity 1s ease-in-out";
                        imageElement.style.opacity = "0";
                        respuestaElement.style.opacity = "1";
                    }, 50);
                }
            }

            setTimeout(() => {
                this.currentIndex++;
                this.isVerifying = false;
                
                if (this.currentIndex >= this.items.length) {
                    this.complete();
                } else {
                    this.loadQuestion();
                }
            }, 2200); // 1.2 segundos para completar la animación (1s crossfade + margen)

        } else {
            // Respuesta incorrecta
            btn.style.backgroundColor = "#e74c3c";
            btn.style.color = "white";

            this.lives--;

            // Actualizar corazones
            if (this.lives === 1 && this.livesElementIds[0]) {
                const vida1 = document.getElementById(this.livesElementIds[0]);
                if (vida1) vida1.src = "assets/icons/corazon_negro.png";
            }
            
            if (this.lives === 0) {
                if (this.livesElementIds[1]) {
                    const vida2 = document.getElementById(this.livesElementIds[1]);
                    if (vida2) vida2.src = "assets/icons/corazon_negro.png";
                }
                
                setTimeout(() => {
                    if (this.onGameOver) {
                        this.onGameOver();
                    }
                }, 700);
            }

            // Restaurar color del botón
            setTimeout(() => {
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "black";
                this.isVerifying = false;
            }, 600);
        }
    }

    complete() {
        const popup = document.getElementById(this.popupId);
        if (popup) {
            popup.classList.add("show");
        }
        
        if (this.onComplete) {
            this.onComplete();
        }
    }

    showPopup() {
        const popup = document.getElementById(this.popupId);
        if (popup) {
            popup.classList.add("show");
        }
    }

    hidePopup() {
        const popup = document.getElementById(this.popupId);
        if (popup) {
            popup.classList.remove("show");
        }
    }
}

/* ===== FUNCIONES DE NAVEGACIÓN ===== */
function goToMenu() {
    window.location.href = "index.html";
}

function goToLevel(levelNumber) {
    window.location.href = `nivel${levelNumber}.html`;
}

/* ===== FUNCIONES DE RECOMPENSAS ===== */
function showRewardPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add("show");
    }
}

function hideRewardPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove("show");
    }
}

function showRewardClaimPopup(claimPopupId) {
    const popup = document.getElementById(claimPopupId);
    if (popup) {
        popup.classList.add("show");
    }
}

