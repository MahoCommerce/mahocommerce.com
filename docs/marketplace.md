# Maho Marketplace

Discover and install powerful modules to enhance your Maho store. All modules are open source and community-maintained.

<style>
.md-sidebar.md-sidebar--primary {display: none}
.md-sidebar.md-sidebar--secondary {display: none}

.app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 24px;
}

.app-card {
    background: var(--md-code-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
}

.app-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.app-category {
    width: fit-content;
    background: #ADB41A;
    color: white;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.8em;
}

.app-title {
    font-size: 1.2em;
    font-weight: 600;
    margin: 5px 0 5px 0 !important;
    color: var(--md-default-fg-color);
}

.app-description {
    color: var(--md-default-fg-color--light);
    font-size: 0.95em;
    line-height: 1.5;
    margin: 0;
}

.app-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: auto;
    padding-top: 16px;
}

.app-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
}

.app-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    text-decoration: none !important;
    font-weight: 500;
    font-size: 0.9em;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    font-family: inherit;
}

.app-button-primary {
    background: #ADB41A;
    color: white !important;
    text-decoration: none;
}

.app-button-primary:hover {
    background: #9ca319;
    color: white !important;
    text-decoration: none;
}

.category-filter {
    margin: 24px 0;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.category-btn {
    padding: 8px 16px;
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 20px;
    background: var(--md-code-bg-color);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9em;
}

.category-btn:hover {
    border-color: #ADB41A;
}

.category-btn.active {
    background: #ADB41A;
    color: white;
    border-color: #ADB41A;
}

.app-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    padding: 20px;
    background: var(--md-code-bg-color);
    border-radius: 8px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2em;
    font-weight: 700;
    color: #ADB41A;
}

.stat-label {
    font-size: 0.9em;
    color: var(--md-default-fg-color--light);
}

.install-dialog {
    padding: 32px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    position: relative;
}

.install-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
}

.install-dialog h3 {
    margin-top: 0;
    margin-bottom: 16px;
}

.install-command {
    background: var(--md-code-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 6px;
    padding: 16px;
    font-family: monospace;
    font-size: 0.9em;
    margin: 16px 0;
    position: relative;
}

.copy-button {
    position: absolute;
    right: 8px;
    top: 8px;
    background: #ADB41A;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.8em;
}

.copy-button:hover {
    background: #9ca319;
}

.close-dialog {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    font-size: 24px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md-default-fg-color--light);
    transition: all 0.2s;
}

.close-dialog:hover {
    background: var(--md-default-fg-color--lightest);
    color: var(--md-default-fg-color);
}
</style>

<div style="padding: 24px; background: var(--md-code-bg-color); border-radius: 8px; display: flex; align-items: center; gap: 24px;">
    <div style="flex: 1; text-wrap: balance;">
        <strong>Have you created a module for Maho?</strong> We'd love to feature it in our Marketplace!<br />
        Open source license (MIT, BSD3, OSL3, Apache), active maintenance, and good documentation required.
    </div>
    <a href="https://github.com/MahoCommerce/mahocommerce.com/issues/new?title=App%20Store%20Submission:%20[Module%20Name]&body=Module%20Name:%20%0ARepository%20URL:%20%0ACategory:%20%0ADescription:%20%0ALicense:%20" class="app-button app-button-primary" target="_blank" style="white-space: nowrap; flex-shrink: 0;">
        + Submit Module
    </a>
</div>

## Featured Modules

<div class="category-filter">
    <button class="category-btn active" onclick="filterApps('all')">All Modules</button>
    <button class="category-btn" onclick="filterApps('developer-tools')">Developer Tools</button>
    <button class="category-btn" onclick="filterApps('localization')">Localization</button>
    <button class="category-btn" onclick="filterApps('marketing')">Marketing</button>
    <button class="category-btn" onclick="filterApps('payment')">Payment</button>
    <button class="category-btn" onclick="filterApps('performance')">Performance</button>
    <button class="category-btn" onclick="filterApps('security')">Security</button>
</div>

<div class="app-grid">
    <!-- Braintree Payment Gateway -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">Braintree Payment Gateway</h3>
        <p class="app-description">Accept credit cards, PayPal, Apple Pay, and Google Pay with Braintree. Features 3D Secure support, vault storage, and comprehensive payment options.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('mahocommerce/module-braintree')">
                    ↓ Install
                </button>
                <a href="https://github.com/MahoCommerce/module-braintree" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Brazilian Market -->
    <div class="app-card" data-category="localization">
        <span class="app-category">Localization</span>
        <h3 class="app-title">Brazilian Market</h3>
        <p class="app-description">Localize your Maho store for Brazil with address field customization, CPF/CNPJ validation with input masking, and automatic formatting for phone numbers and documents.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('ricardomartins/brazilian-market-maho')">
                    ↓ Install
                </button>
                <a href="https://github.com/r-martins/BrazilianMarket-Maho" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Cloudflare Turnstile -->
    <div class="app-card" data-category="security">
        <span class="app-category">Security</span>
        <h3 class="app-title">Cloudflare Turnstile</h3>
        <p class="app-description">Replace Google reCAPTCHA with Cloudflare Turnstile for better privacy and user experience. Provides invisible CAPTCHA protection against bots and spam.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('fballiano/openmage-cloudflare-turnstile')">
                    ↓ Install
                </button>
                <a href="https://github.com/fballiano/openmage-cloudflare-turnstile" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- CSS/JS Versioning -->
    <div class="app-card" data-category="performance">
        <span class="app-category">Performance</span>
        <h3 class="app-title">CSS/JS Versioning</h3>
        <p class="app-description">Automatically version your CSS and JavaScript files to ensure browser cache busting when you deploy updates. Improves site performance and prevents stale cache issues.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('fballiano/openmage-cssjs-versioning')">
                    ↓ Install
                </button>
                <a href="https://github.com/fballiano/openmage-cssjs-versioning" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- HiPay Fullservice -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">HiPay Fullservice</h3>
        <p class="app-description">Complete payment solution supporting 150+ payment methods worldwide. Includes fraud protection, one-click payments, and multi-currency support.</p>
        <div class="app-footer">
            <div class="app-actions">
                <a href="https://github.com/hipay/hipay-fullservice-sdk-magento1" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- HoneySpam -->
    <div class="app-card" data-category="security">
        <span class="app-category">Security</span>
        <h3 class="app-title">HoneySpam</h3>
        <p class="app-description">Protect your forms from spam using honeypot technique. Adds invisible fields to catch bots without affecting real users' experience.</p>
        <div class="app-footer">
            <div class="app-actions">
                <a href="https://github.com/magento-hackathon/HoneySpam" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Ignition Debug Bar -->
    <div class="app-card" data-category="developer-tools">
        <span class="app-category">Developer Tools</span>
        <h3 class="app-title">Ignition Debug Bar</h3>
        <p class="app-description">Beautiful error pages and debugging tools powered by Spatie Ignition. Makes debugging easier with detailed stack traces and context.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('empiricompany/openmage_ignition')">
                    ↓ Install
                </button>
                <a href="https://github.com/empiricompany/openmage_ignition" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Image Cleaner -->
    <div class="app-card" data-category="developer-tools">
        <span class="app-category">Developer Tools</span>
        <h3 class="app-title">Image Cleaner</h3>
        <p class="app-description">Clean up unused product images from your media folder. Safely removes orphaned images to free up disk space and keep your media directory organized.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('fballiano/openmage-image-cleaner')">
                    ↓ Install
                </button>
                <a href="https://github.com/fballiano/openmage-image-cleaner" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Maho DataSync -->
    <div class="app-card" data-category="developer-tools">
        <span class="app-category">Developer Tools</span>
        <h3 class="app-title">Maho DataSync</h3>
        <p class="app-description">Synchronize data between Maho/OpenMage instances with full entity support. Easily transfer products, customers, and other data across environments.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('mageaustralia/maho-datasync')">
                    ↓ Install
                </button>
                <a href="https://github.com/mageaustralia/maho-datasync" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Mollie Payments -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">Mollie Payments</h3>
        <p class="app-description">European payment gateway supporting iDEAL, Bancontact, credit cards, PayPal, and more. Simple integration with competitive pricing.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('mollie/magento')">
                    ↓ Install
                </button>
                <a href="https://github.com/mollie/Magento" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Orphaned Config Cleaner -->
    <div class="app-card" data-category="developer-tools">
        <span class="app-category">Developer Tools</span>
        <h3 class="app-title">Orphaned Config Cleaner</h3>
        <p class="app-description">Clean up orphaned configuration entries from your database. Helps maintain a clean system by removing obsolete configuration values.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('hirale/openmage-orphaned-config')">
                    ↓ Install
                </button>
                <a href="https://github.com/hirale/openmage-orphaned-config" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- PagBank Connect -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">PagBank Connect</h3>
        <p class="app-description">Brazilian stores can now accept local payments like PIX, Boleto and Credit Card (with 3D Secure, installments, etc) via PagBank UOL.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('ricardomartins/pagbank-magento1')">
                    ↓ Install
                </button>
                <a href="https://github.com/r-martins/PagBank-Magento1" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- PayPal Pay Later Banner -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">PayPal Pay Later Banner</h3>
        <p class="app-description">Display PayPal Pay Later promotional banners and messaging. Increase conversions by showing installment payment options to customers.</p>
        <div class="app-footer">
            <div class="app-actions">
                <button class="app-button app-button-primary" onclick="showInstallModal('empiricompany/openmage-paypal-pay-later-banner-info')">
                    ↓ Install
                </button>
                <a href="https://github.com/empiricompany/openmage-paypal-pay-later-banner-info" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Product Badges -->
    <div class="app-card" data-category="marketing">
        <span class="app-category">Marketing</span>
        <h3 class="app-title">Product Badges</h3>
        <p class="app-description">Add customizable badges to your products like "New", "Sale", "Best Seller" and more. Highly configurable with support for custom conditions and styling.</p>
        <div class="app-footer">
            <div class="app-actions">
                <a href="https://github.com/customgento/CustomGento_ProductBadges" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- reCAPTCHA -->
    <div class="app-card" data-category="security">
        <span class="app-category">Security</span>
        <h3 class="app-title">reCAPTCHA</h3>
        <p class="app-description">Add Google reCAPTCHA v2 or v3 to protect your store forms from spam and automated attacks. Supports contact, registration, and review forms.</p>
        <div class="app-footer">
            <div class="app-actions">
                <a href="https://github.com/empiricompany/reCaptcha" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>

    <!-- Stripe Payments -->
    <div class="app-card" data-category="payment">
        <span class="app-category">Payment</span>
        <h3 class="app-title">Stripe Payments</h3>
        <p class="app-description">Accept payments with Stripe's modern payment infrastructure. Supports cards, wallets, and local payment methods with built-in fraud protection.</p>
        <div class="app-footer">
            <div class="app-actions">
                <a href="https://github.com/stripe-archive/stripe-magento1-releases" class="app-button app-button-primary" target="_blank">
                    View Details →
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Install Dialog -->
<dialog class="install-dialog" id="installDialog">
    <button class="close-dialog" onclick="closeInstallModal()" aria-label="Close dialog">×</button>
    <h3>Install Module</h3>
    <p>Run this command in your Maho project root:</p>
    <div class="install-command">
        <code id="installCommand">composer require package-name</code>
        <button class="copy-button" onclick="copyInstallCommand()">Copy</button>
    </div>
</dialog>

<script>
function filterApps(category) {
    const cards = document.querySelectorAll('.app-card');
    const buttons = document.querySelectorAll('.category-btn');
    
    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent === 'All Modules')) {
            btn.classList.add('active');
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showInstallModal(packageName) {
    const dialog = document.getElementById('installDialog');
    const command = document.getElementById('installCommand');
    command.textContent = `composer require ${packageName}`;
    dialog.showModal();
}

function closeInstallModal() {
    document.getElementById('installDialog').close();
}

// Close dialog when clicking outside
document.getElementById('installDialog').addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
        this.close();
    }
});

function copyInstallCommand() {
    const command = document.getElementById('installCommand');
    navigator.clipboard.writeText(command.textContent).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}
</script>