# Maho - The ecommerce platform

<style>
    h1 {font-size:0 !important;}
    .logo {
        width: 100%;
        max-width: 30em;
        overflow: hidden;
        margin: auto;
    }
    @media screen and (max-width: 520px) {
      .logo {
        zoom: 70%;
      }
    }
    .lp {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    .lp > div {
        padding: 10px;
        box-sizing: border-box;
        opacity: 0;
    }
    .lp1 {
        animation: fadeInLeft 0.8s ease-out forwards;
        width: 23%;
    }
    .lp1 img {
        transform: scale(1.15);
    }
    .lp2 {
        animation: fadeInTop 0.8s ease-out forwards;
        animation-delay: 0.2s;
        width: 72%;
    }
    .lp2 img {
        transform: translateY(-10%);
    }
    .lp3 {
        animation: fadeInRight 0.8s ease-out forwards;
        animation-delay: 0.5s;
        width:5%;
        padding:0 !important;
    }
    .lp3 img {
        transform: translateY(-20%);
    }
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px) rotate(-90deg);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes fadeInTop {
        from {
            opacity: 0;
            transform: translateY(-50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>
<div class="logo">
    <div class="lp">
        <div class="lp1"><img alt="" src="assets/maho-symbol.svg" width="90" height="89"></div>
        <div class="lp2"><img alt="" src="assets/maho-logo-only-name.svg" width="326" height="91"></div>
        <div class="lp3"><img alt="" src="assets/maho-logo-dot.svg" width="24" height="24"></div>
    </div>
</div>

Coming soon, in the meanwhile you can check 
[Maho's github repository](https://github.com/MahoCommerce/maho)
for fresh info and code ;-)

Thank you for your patience!  
Maho rocks! 🚀