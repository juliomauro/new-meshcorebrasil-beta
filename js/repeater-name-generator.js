/**
 * Repeater Name Generator v2.0
 * 
 * Uses the official Brazilian city abbreviation list (brazil_cities.json)
 * instead of an algorithm to generate city abbreviations.
 * 
 * Data format: { "UF": [ { "abbr": "SOR", "name": "Sorocaba" }, ... ], ... }
 */

let cityData = null;

/**
 * State names mapping (UF -> full name)
 */
const stateNames = {
    'AC': 'Acre',
    'AL': 'Alagoas',
    'AM': 'Amazonas',
    'AP': 'Amapá',
    'BA': 'Bahia',
    'CE': 'Ceará',
    'DF': 'Distrito Federal',
    'ES': 'Espírito Santo',
    'GO': 'Goiás',
    'MA': 'Maranhão',
    'MG': 'Minas Gerais',
    'MS': 'Mato Grosso do Sul',
    'MT': 'Mato Grosso',
    'PA': 'Pará',
    'PB': 'Paraíba',
    'PE': 'Pernambuco',
    'PI': 'Piauí',
    'PR': 'Paraná',
    'RJ': 'Rio de Janeiro',
    'RN': 'Rio Grande do Norte',
    'RO': 'Rondônia',
    'RR': 'Roraima',
    'RS': 'Rio Grande do Sul',
    'SC': 'Santa Catarina',
    'SE': 'Sergipe',
    'SP': 'São Paulo',
    'TO': 'Tocantins'
};

/**
 * Load city data from JSON file
 */
async function loadCityData() {
    try {
        const response = await fetch('../js/brazil_cities.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        cityData = await response.json();
        populateStates();
    } catch (err) {
        console.error('Erro ao carregar dados de cidades:', err);
        showError('Não foi possível carregar a lista de cidades. Recarregue a página.');
    }
}

/**
 * Populate the state dropdown
 */
function populateStates() {
    const stateSelect = document.getElementById('state-select');
    if (!stateSelect || !cityData) return;

    const states = Object.keys(cityData).sort();
    for (const uf of states) {
        const option = document.createElement('option');
        option.value = uf;
        option.textContent = `${uf} — ${stateNames[uf] || uf}`;
        stateSelect.appendChild(option);
    }
}

/**
 * Populate the city dropdown based on selected state
 */
function populateCities(selectedState) {
    const citySelect = document.getElementById('city-select');
    const cityAbbreviation = document.getElementById('city-abbreviation');
    if (!citySelect) return;

    // Reset
    citySelect.innerHTML = '';
    cityAbbreviation.textContent = '---';

    if (!selectedState || !cityData || !cityData[selectedState]) {
        citySelect.disabled = true;
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Selecione a cidade...';
        citySelect.appendChild(defaultOpt);
        return;
    }

    citySelect.disabled = false;

    // Default option
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Selecione a cidade...';
    citySelect.appendChild(defaultOpt);

    // Add cities for the selected state
    const cities = cityData[selectedState];
    for (const city of cities) {
        const option = document.createElement('option');
        option.value = city.abbr;
        option.textContent = city.name;
        option.dataset.abbr = city.abbr;
        citySelect.appendChild(option);
    }
}

/**
 * Form handling code
 */
document.addEventListener('DOMContentLoaded', function() {
    const stateSelect = document.getElementById('state-select');
    const citySelect = document.getElementById('city-select');
    const cityAbbreviation = document.getElementById('city-abbreviation');
    const regionalIdInput = document.getElementById('regional-id');
    const pubkeyInput = document.getElementById('pubkey');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const resultBox = document.getElementById('result');
    const generatedName = document.getElementById('generated-name');
    const charCountEl = document.getElementById('name-char-count');
    const charLimitWarning = document.getElementById('char-limit-warning');

    const MAX_NAME_LENGTH = 23;

    // Load city data
    loadCityData();

    // State selection change
    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        populateCities(selectedState);
        hideError();
        hideResult();
        updateCharCounter();
    });

    // City selection change — show abbreviation
    citySelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (this.value && selectedOption) {
            cityAbbreviation.textContent = this.value;
        } else {
            cityAbbreviation.textContent = '---';
        }
        hideError();
        hideResult();
        updateCharCounter();
    });

    // Also update on regional and pubkey input changes
    regionalIdInput.addEventListener('input', function() {
        hideError();
        hideResult();
        updateCharCounter();
    });
    pubkeyInput.addEventListener('input', function() {
        // Auto-convert to uppercase
        this.value = this.value.toUpperCase();
        hideError();
        hideResult();
        updateCharCounter();
    });

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        const state = stateSelect.value;
        const cityAbbr = citySelect.value;
        const regional = regionalIdInput.value.trim();
        const pubkey = pubkeyInput.value.trim();

        // Validate inputs
        if (!state) {
            showError('Por favor, selecione o estado.');
            stateSelect.focus();
            return;
        }

        if (!cityAbbr) {
            showError('Por favor, selecione a cidade.');
            citySelect.focus();
            return;
        }

        if (!regional) {
            showError('Por favor, informe o identificador regional.');
            regionalIdInput.focus();
            return;
        }

        if (!pubkey) {
            showError('Por favor, informe a public key.');
            pubkeyInput.focus();
            return;
        }

        if (pubkey.length !== 4) {
            showError('A public key deve ter exatamente 4 caracteres.');
            pubkeyInput.focus();
            return;
        }

        if (!/^[a-f0-9]{4}$/i.test(pubkey)) {
            showError('A public key deve conter apenas caracteres hexadecimais (a-f, 0-9).');
            pubkeyInput.focus();
            return;
        }

        // Generate the name
        const cleanRegional = regional
            .normalize('NFD')
            .replace(/[̀-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s\-]/g, '')
            .toUpperCase()
            .split(/[\s\-]+/)
            .filter(word => word.length > 0)
            .join('');
        const cleanPubkey = pubkey.toUpperCase();

        const fullName = `${cityAbbr}-${cleanRegional}-${cleanPubkey}`;

        // Enforce 23-character limit
        if (fullName.length > MAX_NAME_LENGTH) {
            const maxRegional = MAX_NAME_LENGTH - cityAbbr.length - cleanPubkey.length - 2; // 2 hyphens
            showError(`O nome "${fullName}" tem ${fullName.length} caracteres e ultrapassa o limite de ${MAX_NAME_LENGTH}. Reduza o identificador regional para no máximo ${maxRegional} caracteres (atualmente tem ${cleanRegional.length}).`);
            regionalIdInput.focus();
            return;
        }

        generatedName.textContent = fullName;
        showResult();
        hideError();
    });

    // Reset button click handler
    resetBtn.addEventListener('click', function() {
        stateSelect.value = '';
        citySelect.innerHTML = '<option value="">Selecione a cidade...</option>';
        citySelect.disabled = true;
        cityAbbreviation.textContent = '---';
        regionalIdInput.value = '';
        pubkeyInput.value = '';
        hideError();
        hideResult();
        charLimitWarning.style.display = 'none';
        updateCharCounter();
        stateSelect.focus();
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        const name = generatedName.textContent;
        navigator.clipboard.writeText(name).then(function() {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copiado!';
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(function() {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = name;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copiado!';
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function showResult() {
        resultBox.style.display = 'block';
    }

    function hideResult() {
        resultBox.style.display = 'none';
    }

    /**
     * Update the live character counter based on current form state.
     * Shows the projected length of the final name (CIDADE-REGIONAL-PUBKEY).
     */
    function updateCharCounter() {
        const cityAbbr = citySelect.value || ''; // 3 chars if selected
        const regional = regionalIdInput.value.trim();
        const pubkey = pubkeyInput.value.trim();

        // Calculate the cleaned regional (same logic as generate)
        const cleanRegional = regional
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s\-]/g, '')
            .toUpperCase()
            .split(/[\s\-]+/)
            .filter(word => word.length > 0)
            .join('');
        const cleanPubkey = pubkey.toUpperCase();

        const projectedLength = cityAbbr.length + (cityAbbr && cleanRegional ? 1 : 0) + cleanRegional.length + (cleanRegional && cleanPubkey ? 1 : 0) + cleanPubkey.length;
        // More accurate: always 2 hyphens if all parts are present
        const parts = [cityAbbr, cleanRegional, cleanPubkey].filter(p => p.length > 0);
        const hyphens = parts.length > 1 ? parts.length - 1 : 0;
        const total = parts.reduce((sum, p) => sum + p.length, 0) + hyphens;

        charCountEl.textContent = total;

        if (total > MAX_NAME_LENGTH) {
            charCountEl.classList.add('char-counter-over');
            charLimitWarning.style.display = 'block';
        } else {
            charCountEl.classList.remove('char-counter-over');
            charLimitWarning.style.display = 'none';
        }
    }
});
