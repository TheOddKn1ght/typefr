<script>
    let text = $state('');
    let altPressed = $state(false);
    let altSequence = $state('');
    let currentCyclingChar = $state('');
    let textareaRef;
    
    
    $effect(() => {
        if (typeof window !== 'undefined') {
            const savedText = localStorage.getItem('frenchTypingText');
            if (savedText !== null) {
                text = savedText;
            }
        }
    });
    
    
    $effect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('frenchTypingText', text);
        }
    });
    
    
    const frenchChars = {
        'e': ['é', 'è', 'ê', 'ë'],
        'a': ['à', 'â', 'ä'],
        'i': ['î', 'ï'],
        'o': ['ô', 'ö', 'œ'],
        'u': ['ù', 'û', 'ü'],
        'y': ['ÿ'],
        'c': ['ç'],
        'n': ['ñ'],
        's': ['ß']
    };
    
    
    const frenchCharsCapital = {
        'e': ['É', 'È', 'Ê', 'Ë'],
        'a': ['À', 'Â', 'Ä'],
        'i': ['Î', 'Ï'],
        'o': ['Ô', 'Ö', 'Œ'],
        'u': ['Ù', 'Û', 'Ü'],
        'y': ['Ÿ'],
        'c': ['Ç'],
        'n': ['Ñ'],
        's': ['ẞ']
    };
    
    function handleKeyDown(event) {
        
        if (event.altKey) {
            
            if (!altPressed) {
                altPressed = true;
                altSequence = '';
                currentCyclingChar = '';
            }
            
            
            event.preventDefault();
            
            const key = event.key.toLowerCase();
            
            
            if (frenchChars[key]) {
                
                if (currentCyclingChar !== '' && currentCyclingChar !== key) {
                    altSequence = '';
                    currentCyclingChar = key;
                } else if (currentCyclingChar === '') {
                    currentCyclingChar = key;
                }
                
                
                altSequence += key;
                
                
                const isCapital = event.shiftKey;
                const charSet = isCapital ? frenchCharsCapital[key] : frenchChars[key];
                const charIndex = (altSequence.length - 1) % charSet.length;
                const frenchChar = charSet[charIndex];
                
                
                if (altSequence.length === 1) {
                    text += frenchChar;
                } else {
                    
                    const lastChar = text.slice(-1);
                    const possibleChars = charSet;
                    
                    if (possibleChars.includes(lastChar)) {
                        
                        text = text.slice(0, -1) + frenchChar;
                    } else {
                        
                        text += frenchChar;
                    }
                }
                
                
                adjustTextareaSize();
            } else if (event.key === 'Escape') {
                
                altPressed = false;
                altSequence = '';
                currentCyclingChar = '';
            }
        }
    }
    
    function handleKeyUp(event) {
        
        if (event.key === 'Alt') {
            altPressed = false;
            altSequence = '';
            currentCyclingChar = '';
        }
    }
    
    function handleInput(event) {
        if (!altPressed) {
            text = event.target.value;
        }
        
        adjustTextareaSize();
    }
    
    function adjustTextareaSize() {
        if (textareaRef) {
            textareaRef.style.height = 'auto';
            textareaRef.style.height = textareaRef.scrollHeight + 'px';
        }
    }
    
    $effect(() => {
        
        adjustTextareaSize();
    });
    
    
    $effect(() => {
        if (textareaRef) {
            adjustTextareaSize();
        }
    });
    

</script>

<svelte:head>
    <title>French Typing Tool</title>
    <meta name="description" content="Type French special characters using Alt key combinations" />
</svelte:head>

<main>
    <div class="container">
        <h1>French typing tool</h1>
        
        <div class="input-section">
            
            <textarea
                id="text-input"
                bind:this={textareaRef}
                bind:value={text}
                onkeydown={handleKeyDown}
                onkeyup={handleKeyUp}
                oninput={handleInput}
                placeholder="Start typing..."
                rows="1"
            ></textarea>
            
            <div class="controls">
                {#if altPressed}
                    <div class="alt-indicator">Alt Mode Active</div>
                {/if}
            </div>
        </div>
        
        <div class="instructions">
            <h2>How to use:</h2>
            <p>Hold <kbd>Alt</kbd> and press a letter to type French special characters. Add <kbd>Shift</kbd> for capital letters:</p>
            
            <div class="char-grid">
                {#each Object.entries(frenchChars) as [baseChar, specialChars]}
                    <div class="char-group">
                        <span class="base-char">Alt + {baseChar}</span>
                        <div class="special-chars">
                            {#each specialChars as char, index}
                                <span class="special-char">{char}</span>
                                {#if index < specialChars.length - 1}
                                    <span class="arrow">→</span>
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
            

        </div>
    </div>
</main>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: var(--fg);
        background-color: var(--bg);
    }
    
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
    }
    
    h1 {
        text-align: center;
        color: var(--blue);
        margin-bottom: 2rem;
        font-size: 2.5rem;
    }
    
    h2 {
        color: var(--blue);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .input-section {
        margin-bottom: 3rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--fg);
    }
    
    textarea {
        width: 100%;
        min-height: 60px;
        padding: 1rem;
        border: 2px solid var(--code_bg);
        border-radius: 8px;
        font-size: 1.1rem;
        font-family: inherit;
        background-color: var(--bg);
        color: var(--fg);
        resize: vertical;
        transition: border-color 0.2s ease;
    }
    
    textarea:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 0 0 0 3px rgba(129, 161, 193, 0.1);
    }
    
    textarea::placeholder {
        color: var(--gray);
    }
    
    .controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    

    
    .alt-indicator {
        padding: 0.5rem 1rem;
        background-color: var(--yellow);
        color: var(--fg);
        border-radius: 6px;
        font-weight: 600;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .instructions {
        background-color: var(--code_bg);
        padding: 2rem;
        border-radius: 8px;
        border-left: 4px solid var(--blue);
    }
    
    .char-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .char-group {
        background-color: var(--bg);
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid var(--code_bg);
    }
    
    .base-char {
        display: block;
        font-weight: 600;
        color: var(--blue);
        margin-bottom: 0.5rem;
        font-family: monospace;
    }
    
    .special-chars {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .special-char {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--magenta);
        padding: 0.2rem 0.4rem;
        background-color: var(--code_bg);
        border-radius: 4px;
        min-width: 1.5rem;
        text-align: center;
    }
    
    .arrow {
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    kbd {
        background-color: var(--code_bg);
        border: 1px solid var(--gray);
        border-radius: 3px;
        padding: 0.2rem 0.4rem;
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--code_fg);
    }
        
    @media (max-width: 600px) {
        .container {
            padding: 1rem;
        }
        
        h1 {
            font-size: 2rem;
        }
        
        .char-grid {
            grid-template-columns: 1fr;
        }
        
        .controls {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>
