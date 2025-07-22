const icons = new Map();
let seedIsLoaded = false;
const MapStates = Object.freeze({
    ImageMap: 0,
    TileMap: 1,
    Dungeon: 2,
    Submap: 3,
    FlooredSubmap: 4
});


function getIcon(image) {
    if (image in icons.keys())
        return icons.get(image);
    let mult = window.innerWidth <= window.innerHeight ? window.innerWidth / 1600 : window.innerHeight / 739;
    let maxSize = 50 * mult;
    if (maxSize > 50)
        maxSize = 50;
    else if (maxSize < 30)
        maxSize = 30;
    if (width >= height) {
        height = height / width * maxSize;
        width = maxSize;
    }
    else {
        width = width / height * maxSize;
        height = maxSize;
    }
    let icon = L.icon({iconUrl: image.src, iconSize: [image.width, image,height]});
    icons.set(image, icon);
    return icon; 
}

function displayItem(item, cSSClass="iti") {
    return '<img class="ii ' + cSSClass + '" src="' + item.image.url + '">' +
    '<p class="itp">' + item.name + '</p>';
}

function isVisible(marker) {

}

function initializeFlag(flag) {
    flag.marker = L.marker(flag.position, {
        icon: getIcon(flag.image),
        riseOnHover: true, 
        riseOffset: 2000, 
        keyboard: false, 
    });


    flag.marker.on('click', () => {
        let base;
        let requirements;
        let description;
        if (selectedGamemode !== Gamemodes.Base && seedIsLoaded)
            base = flag.randoBase;
        else
            base = flag.base;

        switch(selectedGamemode) {
            case Gamemodes.Base : {
                requirements = flag.baseReqs;
                description = flag.baseDesc;               
            }
            case Gamemodes.Glitchless : {
                requirements = flag.randoReqs;
                description = flag.randoDesc;
            }
            case Gamemodes.Glitched : {
                requirements = flag.glitchedReqs;
                description = flag.glitchedDesc;
            }
        }
        let box = document.getElementById('flagDetails');
        box.style.visibility = "visible";
        box.style.width = "25%";
        box.style.height = "100%";
        setTimeout(function() {document.getElementById('flagDetailsX').style.visibility = "visible";}, 100);        
        if (base instanceof Container) {
            document.getElementById('containerContent').style.display = "block";
            document.getElementById('containerContentDiv').innerHTML = displayItem(base.content);
        }
        else 
            document.getElementById('containerContent').style.display = "none";
        if (requirements.length === 0) {
            document.getElementById('flagRequirements').style.display = "block";
            let rdHtml = "";
            for (let i = 0; i < requirements.length; ++i) {
                let currentReq = requirements[i];
                if (Array.isArray(currentReq)) {
                    rdHtml += '<div class="oritems"><div class="oritf"><p class="idot">•</p>' + displayItem(currentReq[0]) + '</div>';
                    for(let j = 1; j < currentReq; ++j) {
                        rdHtml += '<div class="orits"><p class="por">or</p>' + displayItem(currentReq[j], "itis") + '</div>';
                    }
                    rdHtml += '</div>';
                }
                else {
                    rdHtml += '<div class="item"><p class="idot">•</p>' + displayItem(requirements[i],) + '</div>';
                }
            }
            document.getElementById('flagRequirementsDiv').innerHTML = rdHtml;
        }
        else 
            document.getElementById('flagRequirements').style.display = "none";
        document.getElementById('flagDescription').style.visibility = "visible";
        document.getElementById('flagDescriptionDiv').innerHTML = description;
        map.on('click', hideDetails);
    }),

    // flag.
    // flag.marker.on('contextmenu', ())

    flag.load = () => {
        if (isVisible(this))
            this.marker.addTo(map);
    };

}

function initializeNonFlag(nonFlag) {
    nonFlag.marker = L.marker(nonFlag.position, {
        icon: getIcon(nonFlag.image),
        riseOnHover: true, 
        riseOffset: 2000, 
        keyboard: false, 
        zIndexOffset: -1100
    });
    nonFlag.load = () => {
        if (isVisible(this))
            this.marker.addTo(map);
    }
}

function initializeFloor(floor) {

}



document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map', {
        zoom: -5,
        minZoom: -5,
        maxZoom: 0,
        center: [-4913, 4257],
        crs: L.CRS.Simple,
        maxBoundsViscosity: 1,
        zoomControl: false,
        keyboard: false,
        doubleClickZoom: false
    }); 
    const TL = L.tileLayer('Tiles/{z}/{x}/{y}.png', {
        maxZoom: 0,
        minZoom: -6,
        zoomOffset: 6,
        crs: L.CRS.Simple,
        bounds: [[0, 0], [-9826, 8515]] 
    })
    for (let province of Object.values(provinces)) {
        province.poly = L.polygon(polyPoints, { fillColor: '#6e5b1e', fillOpacity: 0, opacity: 0});
        province.poly.on('mouseover', () => this.setStyle({ fillOpacity: 0.5 }));
        province.poly.on('mouseout', () => this.setStyle({ fillOpacity: 0 }));
        province.load = () => {
            this.poly.addTo(map);
            this.poly.setStyle({ fillOpacity: 0 });
            L.marker(this.counterPos, {
                icon: L.divIcon({ html: '<div class="cpt procpt">' + this.countVisibleMarkers() + '</div>'}),
                interactive: false
            }).addTo(map);
            
        };
        for (let c of province.contents) {
            if (c instanceof Flag)
                initializeFlag(c);
            else if (c instanceof NonFlag)
                initializeNonFlag(c);
            else if (c instanceof SimpleSubmap) {

            }
            else if (c instanceof SimpleFlooredSubmap) {

            }
        }
        province.countVisibleMarkers = () => {
            for (let c of province.contents) {

            }
        }
    }
})