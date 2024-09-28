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
    #createInputField(name, val) {
        const container = document.createElement('div');
        const label = document.createElement("label");
        label.textContent = name;
        const inputField = document.createElement('input');
        inputField.placeholder = name;
        inputField.value = val;
        
        container.appendChild(label);
        container.appendChild(inputField);
        
        return container; 
    }
    #clearOverlay() {
        if (this.popupCount === 1) {
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

    getConfirmation(message, confirmText = "Yes", cancelText = "No", callBack) {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("confirmationBox");
        wrapper.appendChild(this.#createMessageElement(message));
        const confirmButton = this.#createButton(confirmText, () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            callBack();
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

    getEditResponse(message, nameValueObj, callback) {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("editBox");
        fragment.appendChild(wrapper);
        wrapper.appendChild(this.#createMessageElement(message));

        const inputFields = {};
        for (let [key, val] of Object.entries(nameValueObj)) {
            const inputFieldContainer = this.#createInputField(key, val);
            if (key === 'id' || key === 'tableRowId') {
                inputFieldContainer.querySelector('input').readOnly = true;
            }
            wrapper.appendChild(inputFieldContainer);
            inputFields[key] = inputFieldContainer.querySelector('input');
        }

        const confirmButton = this.#createButton("Save", () => {
            const response = {};
            for (const name in inputFields) {
                response[name] = inputFields[name].value;
            }
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            callback(response);
            console.log('Edited Values:', response);
        });

        const cancelButton = this.#createButton("Cancel", () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            console.log('Edit canceled');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        buttonContainer.append(confirmButton, cancelButton);
        wrapper.appendChild(buttonContainer);
        this.overlay.appendChild(fragment);
    }

    getAddResponse(message, headers, callback) {
        this.#shoOverlay();
        const fragment = document.createDocumentFragment();
        const wrapper = this.#createWrapper("addBox");
        fragment.appendChild(wrapper);
        wrapper.appendChild(this.#createMessageElement(message));

        const inputFields = {};
        headers.forEach((name) => {
            const inputFieldContainer = this.#createInputField(name, '');
            wrapper.appendChild(inputFieldContainer);
            inputFields[name] = inputFieldContainer.querySelector('input');
        });

        const confirmButton = this.#createButton("Add", () => {
            const response = {};
            for (const name in inputFields) {
                response[name] = inputFields[name].value;
            }
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            callback(response);
            console.log('Added Values:', response);
        });

        const cancelButton = this.#createButton("Cancel", () => {
            this.overlay.removeChild(wrapper);
            this.#clearOverlay();
            console.log('Add canceled');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        buttonContainer.append(confirmButton, cancelButton);
        wrapper.appendChild(buttonContainer);
        this.overlay.appendChild(fragment);
    }
}

export default Overlay;
