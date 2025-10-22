// Get all necessary elements from the HTML
const inputCode = document.getElementById('input-code');
const outputSnippet = document.getElementById('output-snippet');
const convertButton = document.getElementById('convert-button');
const copyButton = document.getElementById('copy-button');
const outputLanguage = document.getElementById('output-language');
const loadingIndicator = document.getElementById('loading-indicator');

// --- 1. The Conversion Logic (Calls Netlify Function) ---
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
        // REAL API CALL TO NETLIFY FUNCTION
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
            // Success: Display the generated snippet
            outputSnippet.textContent = result.snippet;
        } else {
            // Failure: Display the error message from the server
            const errorMessage = result.error || 'Unknown error occurred on the server.';
            outputSnippet.textContent = `Error: ${errorMessage}`;
        }
    } catch (error) {
        // Network or unexpected error
        outputSnippet.textContent = `Error: Failed to connect to converter. Check your connection.`;
        console.error('Conversion Error:', error);
    } finally {
        // Hide loading spinner
        loadingIndicator.style.display = 'none';
    }
}

// --- 2. The Copy Button Logic ---
function copySnippet() {
    if (!outputSnippet.textContent || outputSnippet.textContent.includes('Converting') || outputSnippet.textContent.includes('appear here') || outputSnippet.textContent.includes('Error:')) {
        alert("There is no valid generated code to copy yet!");
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