var Lightness = {
    convertColourToLightness : function (colour) {
        if (colour.match(/^#?[0-9]{6}$/)) {
            return this.convertHexCodeToLightness(colour);
        } else {
            return this.convertRgbToLightness(colour);
        }
    },
    convertHexCodeToLightness : function (hexCode) {
        hexCode = hexCode.replace(/^#/, "");

        var r = parseInt(hexCode.substring(0, 2), 16),
            g = parseInt(hexCode.substring(2, 4), 16),
            b = parseInt(hexCode.substring(4, 6), 16);

        return this.convertRgbPartsToLightness(r, g, b);
    },
    convertRgbToLightness : function (rgb) {
        rgb = rgb.match(/\d+/g);

        var r = rgb[0],
            g = rgb[1],
            b = rgb[2];

        return this.convertRgbPartsToLightness(r, g, b);
    },
    convertRgbPartsToLightness : function (r, g, b) {
        r /= 255; g /= 255; b /= 255;

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            lightnessValue = (max + min) / 2;

        return Math.floor(lightnessValue * 100);
    }
};

(function ($) {
    $.fn.getLightness = function (options) {
        var settings = $.extend({}, {
            colourType: "background",
            darkClass: "dark",
            lightClass: "light",
            percentage: 50
        }, options);

        var updateElement = function ($element, lightnessValue) {
            $element.data("lightness", lightnessValue);

            if (lightnessValue > settings.percentage) {
                $element.addClass(settings.lightClass).removeClass(settings.darkClass);
            } else {
                $element.addClass(settings.darkClass).removeClass(settings.lightClass);
            }
        };

        this.each(function (index, element) {
            var $element = $(element),
                colourElement,
                lightnessValue;

            switch (settings.colourType) {
                case "color" :
                    colourElement = $element.css("color");
                    break;

                case "background":
                    colourElement = $element.css("background-color");
                    break;

                case "image":
                    if (typeof RGBaster === "undefined") {
                        throw Error("RGBaster must be installed to perform this colourType");
                    }

                    if (!$element.is('img')) {
                        throw Error("Only img tags are supported for this colourType");
                    }

                    RGBaster.colors(element, function (payload) {
                        lightnessValue = Lightness.convertColourToLightness(payload.dominant);

                        updateElement($element, lightnessValue);
                    }, 1);

                    return;

                default:
                    throw Error("Unrecognised colourType; must be one of 'color', 'background', or 'image'");
            }

            lightnessValue = Lightness.convertColourToLightness(colourElement);

            updateElement($element, lightnessValue);
        });
    }
})(jQuery);
