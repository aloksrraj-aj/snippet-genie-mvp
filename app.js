// Get all necessary elements from the HTML
const inputCode = document.getElementById('input-code');
const outputSnippet = document.getElementById('output-snippet');
const convertButton = document.getElementById('convert-button');
const copyButton = document.getElementById('copy-button');
const outputLanguage = document.getElementById('output-language');
const loadingIndicator = document.getElementById('loading-indicator');

// --- 1. The Conversion Logic (Will call Netlify Function later) ---
async function convertCode() {
    const curlInput = inputCode.value.trim();
    const targetLang = outputLanguage.value;

    if (!curlInput) {
        alert("Please paste your cURL command or code here.");
        return;
    }

    // Show loading spinner and clear previous output
    loadingIndicator.style.display = 'block';
    outputSnippet.textContent = 'Converting...';

    try {
        // We will replace this placeholder with a real fetch call to our Netlify Function soon.
        // For now, let's simulate the output.
        
        // --- REAL API CALL TO NETLIFY FUNCTION ---
        const response = await fetch('/.netlify/functions/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                curlInput: curlInput,
                targetLang: targetLang
            })
        });

        const result = await response.json();

        if (response.ok) {
            outputSnippet.textContent = result.snippet;
        } else {
            outputSnippet.textContent = `Error from server: ${result.error || 'Unknown error.'}`;
        }
        // ------------------------------------------
    } catch (error) {
        outputSnippet.textContent = `Error: Failed to convert. Try again.`;
        console.error('Conversion Error:', error);
    } finally {
        // Hide loading spinner
        loadingIndicator.style.display = 'none';
    }
}

// --- 2. The Copy Button Logic ---
function copySnippet() {
    if (!outputSnippet.textContent || outputSnippet.textContent.includes('Converting') || outputSnippet.textContent.includes('appear here')) {
        alert("There is no generated code to copy yet!");
        return;
    }
    
    // Use the modern clipboard API
    navigator.clipboard.writeText(outputSnippet.textContent)
        .then(() => {
            // Quick visual feedback
            copyButton.textContent = "Copied!";
            setTimeout(() => {
                copyButton.textContent = "Copy Code";
            }, 1500);
        })
        .catch(err => {
            console.error('Copy failed', err);
            alert("Could not copy code. Please copy manually.");
        });
}


// --- 3. Event Listeners: Attaching logic to buttons ---
convertButton.addEventListener('click', convertCode);
copyButton.addEventListener('click', copySnippet);