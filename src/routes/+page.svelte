<script>
    let text = $state('');
    let altPressed = $state(false);
    let altSequence = $state('');
    let currentCyclingChar = $state('');
    let textareaRef;
    let copySuccess = $state(false);
    let isMac = $state(false);

    $effect(() => {
      if (typeof window !== 'undefined') {
        // Detect macOS
        isMac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform) || 
                /Mac|Intel|PPC|68K/i.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        const savedText = localStorage.getItem('frenchTypingText');
        if (savedText !== null) {
          text = savedText;
          setTimeout(() => adjustTextareaSize(), 0);
        }
      }
    });

    let saveTimeout;
    $effect(() => {
      if (typeof window === 'undefined') return;
      const current = text;
      const id = setTimeout(() => {
        try { localStorage.setItem('frenchTypingText', current); }
        catch (e) { console.warn('localStorage save failed', e); }
      }, 1000);
      return () => clearTimeout(id);
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
        if (event.altKey && !event.metaKey && !event.ctrlKey) {
            if (!altPressed) {
                altPressed = true;
                altSequence = '';
                currentCyclingChar = '';
            }
            
            event.preventDefault();
            event.stopPropagation();
            
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
            } else if (isMac) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    
    function handleKeyUp(event) {
        if (!event.altKey || event.key === 'Alt' || event.key === 'AltLeft' || event.key === 'AltRight' || event.key === 'AltGraph') {
            altPressed = false;
            altSequence = '';
            currentCyclingChar = '';
        }
    }
    
    function handleInput(event) {
        if (!altPressed) {
            text = event.target.value;
        } else {
            if (textareaRef && textareaRef.value !== text) {
                const cursorPos = textareaRef.selectionStart;
                textareaRef.value = text;
                setTimeout(() => {
                    if (textareaRef) {
                        const newPos = Math.min(cursorPos, text.length);
                        textareaRef.setSelectionRange(newPos, newPos);
                    }
                }, 0);
            }
        }
        adjustTextareaSize();
    }
    
    function adjustTextareaSize() {
        if (textareaRef) {
            textareaRef.style.height = 'auto';
            textareaRef.style.height = textareaRef.scrollHeight + 'px';
        }
    }
    
    async function copyToClipboard() {
        if (!text.trim()) return;
        
        try {
            await navigator.clipboard.writeText(text);
            copySuccess = true;
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
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
    {#if altPressed}
        <div class="alt-indicator">Alt Mode Active</div>
    {/if}

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
            <div class="button-container">
                {#if text.trim()}
                    <button 
                        class="copy-button"
                        onclick={copyToClipboard}
                        title="Copy to clipboard"
                    >
                        {copySuccess ? '✓ Copied!' : 'Copy'}
                    </button>
                {/if}
            </div>
        </div>
        
        <div class="instructions">
            <h2>How to use:</h2>
            <p>Hold <kbd>{isMac ? 'Option' : 'Alt'}</kbd> and press a letter to type French special characters. Add <kbd>Shift</kbd> for capital letters:</p>
            <div class="char-grid">
                {#each Object.entries(frenchChars) as [baseChar, specialChars]}
                    <div class="char-group">
                        <span class="base-char">{isMac ? 'Option' : 'Alt'} + {baseChar}</span>
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
    <footer>
        <a href="https://oddknight.space">oddknight.space</a>
    </footer>
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
        min-height: 100vh;
        margin: 0;
        display: flex;
        flex-direction: column;
    }
    
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    
    footer {
        text-align: center;
        padding: 1rem;
        margin-top: auto;
        a {
            color: var(--link);
            text-decoration: none;
        }
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        flex: 1;
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
        display: flex;
        flex-direction: column;
        align-items: center;
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
        margin-bottom: 0.5rem;
    }
    
    .button-container {
        min-height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .copy-button {
        padding: 0.5rem 1rem;
        background-color: var(--blue);
        color: var(--bg);
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        transform: scale(0.8) translateY(-10px);
        animation: buttonAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes buttonAppear {
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .copy-button:hover {
        background-color: var(--lightblue);
        transform: scale(1) translateY(-1px);
    }
    
    .copy-button:active {
        transform: scale(0.98) translateY(0);
    }
    
    textarea:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 0 0 0 3px rgba(129, 161, 193, 0.1);
    }
    
    textarea::placeholder {
        color: var(--gray);
    }

    .alt-indicator {
        position: fixed;
        top: 1rem;
        left: 1rem;
        padding: 0.5rem 1rem;
        background-color: var(--code_bg);
        color: var(--fg);
        border-radius: 6px;
        font-weight: 600;
        z-index: 9999;
        animation: pulse 1s infinite;
        transition: opacity 0.3s ease;
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
    }
</style>
