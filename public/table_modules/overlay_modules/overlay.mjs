class Overlay {
    constructor() {
        this.#createOverlay();
        this.popupCount = parseInt(0);
        this.inputFields = {};
    }

    // private helper functions
    #createWrapper(type) {
        const popup = document.createElement('div');
        popup.classList.add('popup', type);
        return popup;
    }
    #createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add("customOverlay", "hidden");
        document.body.appendChild(this.overlay);
    }
    #createMessageElement(message) {
        const messageElem = document.createElement('h2');
        messageElem.textContent = message;
        return messageElem;
    }
    #createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }
    #createInputField(name) {
        const inputField = document.createElement('input');
        inputField.placeholder = name;
        return inputField;
    }
    #clearOverlay() {
        if (this.popupCount == 1) {
            this.overlay.classList.toggle('hidden');
            this.overlay.classList.toggle('visible');
        }
        this.popupCount--;
    }
    #shoOverlay() {
        if (this.popupCount <= 0) {
            this.overlay.classList.toggle("hidden");
            this.overlay.classList.toggle('visible');
        }
        this.popupCount++;
    }

    // public methods (can be used outside of the doc)

    showPopup(message) {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("messageBox");
        const button = this.#createButton("OK", () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
        });
        wrapper.appendChild(this.#createMessageElement(message));
        wrapper.append(button);
        fragment.appendChild(wrapper);
        this.overlay.appendChild(fragment);
    }

    getConfirmation(message, confirmText = "Yes", cancelText = "No") {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("confirmationBox");
        wrapper.appendChild(this.#createMessageElement(message));
        const confirmButton = this.#createButton(confirmText, () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            console.log('User confirmed');
        });

        const cancelButton = this.#createButton(cancelText, () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            console.log('User canceled');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        buttonContainer.append(confirmButton, cancelButton);
        wrapper.appendChild(buttonContainer);
        fragment.appendChild(wrapper);
        this.overlay.appendChild(fragment);
    }

    getEditResponse(message, nameValueObjArr) {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("editBox");
        fragment.appendChild(wrapper);
        wrapper.appendChild(this.#createMessageElement(message));

        const inputFields = {};
        nameValueObjArr.forEach(({ name }) => {
            const inputField = this.#createInputField(name);
            wrapper.appendChild(inputField);
            inputFields[name] = inputField;
        });

        const confirmButton = this.#createButton("Save", () => {
            const response = {};
            for (const name in inputFields) {
                response[name] = inputFields[name].value;
            }
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            console.log('Edited Values:', response);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        buttonContainer.appendChild(confirmButton);
        wrapper.appendChild(buttonContainer);
        this.overlay.appendChild(fragment);
    }

}

export default Overlay;
