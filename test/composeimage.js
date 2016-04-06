var app = angular.module('ComposeImageApp', ['ngResource', 'angularSpectrumColorpicker']);

app.controller('AppController', AppController);
app.factory('Remote', Remote);

Remote.$inject = ['$resource', '$location'];
function Remote($resource, $location) {
    var host = $location.host();
    var server = 'http://api.localhost:3000';
    if (host === 'localhost') {
        server = 'http://api.localhost:3000';
    } else {
        server = 'http://api.quotesform.com';
    }

    server = 'http://api.quotesform.com';

    console.log('Remote : host = ' + host + ' server = ' + server);

    return $resource(server, {}, {
        allImages: {
            method: 'GET',
            isArray: true,
            url: server + '/image',
        },
    });

};


AppController.$inject = ['$scope', '$window', '$location', '$timeout', 'Remote'];
function AppController($scope, $window, $location, $timeout, Remote) {
    var IMAGE_SERVER = 'http://image.quotesform.com';
    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = imageLoaded;
    $scope.background = {
        canvas: canvas,
        ctx: ctx,
        image: img,
        fill: fill,
        fillX: fillX,
        fillY: fillY,
        isFill: false,
        isFillX: false,
        isFillY: false,
        changeImageUrl: changeImageUrl,
        changeColor: changeColor,
        dime: {
            src: {
                left: 0,
                top: 0,
                right: 600,
                bottom: 400
            },
            dest: {
                left: 0,
                top: 0,
                right: 600,
                bottom: 400
            }
        }
    };

    var search = {
        page: 0,
        order: '-_id',
        limit: 45,
        skip: 0,
        where: {},
        hasPrev: false,
        hasNext: false,
    };

    $scope.quote = {
        extra: 'Title text',
        text: 'Quotes text',
        author: {name: 'Author name'}
    };

    $scope.newText = '';
    $scope.textId = 0;
    $scope.selectedTextElement = null;
    $scope.refreshComposer = refreshComposer;
    $scope.changeBackgroundColor = changeBackgroundColor;
    $scope.downloadImage = downloadImage;
    $scope.nextPage = nextPage;
    $scope.hasNext = hasNext;
    $scope.prevPage = prevPage;
    $scope.hasPrev = hasPrev;
    $scope.changeBackgroundImageUrl = changeBackgroundImageUrl;
    $scope.backgroundImage = {};
    $scope.getImageUrlFromPath = getImageUrlFromPath;
    $scope.views = {};
    $scope.images = [];
    $scope.applyText = applyText;
    $scope.changeFont = changeFont;
    $scope.changeFontSize = changeFontSize;
    $scope.changeTextColor = changeTextColor;
    $scope.changeTextDecoration = changeTextDecoration;
    $scope.changeFontWeight = changeFontWeight;
    $scope.changeFontStyle = changeFontStyle;
    $scope.changeTextTransform = changeTextTransform;
    $scope.resetTextSliders = resetTextSliders;


    init();


    function init() {
        var query = $location.search();
        if (query) {
            if (query.quoteId) {
                $scope.quote._id = query.quoteId;
            }
        }


        resetSearch();
        loadQuote();
        loadImages();

        $timeout(function () {
            /* initComposer();
             resetBackground();
             refreshComposer();*/
        }, 1000);

        changeImageUrl('http://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Equus_quagga_%28Namutoni%2C_2012%29.jpg/1280px-Equus_quagga_%28Namutoni%2C_2012%29.jpg');
        $(".text").draggable({containment: '#composer'});
    }

    function resetTextSliders() {
        console.log('resetTextSliders called');
        if ($scope.selectedTextElement) {
            var element = $($scope.selectedTextElement);
            var left = element.position().left;
            var top = element.position().top;
            var height = element.height();
            var width = element.width();

            $('#textsliderx').slider({
                min: 10,
                max: $scope.background.dime.dest.right - width,
                value: left,
                slide: onTextSoliderX,
            });

            $('#textslidery').slider({
                min: 0,
                max: $scope.background.dime.dest.bottom - height - 15,
                value: top,
                slide: onTextSoliderY,
            });

            $('#textsliderwidth').slider({
                min: 10,
                max: $scope.background.dime.dest.right - width,
                value: left,
                slide: onTextSoliderX,
            });

            $('#textsliderwidth').slider({
                min: width + 10,
                max: $scope.background.dime.dest.right - (left + width),
                value: left,
                slide: onTextSoliderWidth,
            });

            $('#textsliderheight').slider({
                min: height + 10,
                max: $scope.background.dime.dest.bottom - (top + height),
                value: left,
                slide: onTextSoliderHeight,
            });
        }
    }

    function onTextSoliderX(event, ui) {
        if ($scope.selectedTextElement) {
            var element = $($scope.selectedTextElement);
            var top = element.position().top;
            element.css({
                'position': 'absolute',
                left: ui.value + 'px',
                top: top + 'px',
            });
        }
    }

    function onTextSoliderY(event, ui) {
        if ($scope.selectedTextElement) {
            var element = $($scope.selectedTextElement);
            var left = element.position().left;
            element.css({
                'position': 'absolute',
                left: left + 'px',
                top: ui.value + 'px',
            });
        }
    }

    function onTextSoliderHeight(event, ui) {
        if ($scope.selectedTextElement) {
            var element = $($scope.selectedTextElement);
            element.css({
                height: ui.value + 'px',
            });
        }
    }

    function onTextSoliderWidth(event, ui) {
        if ($scope.selectedTextElement) {
            var element = $($scope.selectedTextElement);
            element.css({
                width: ui.value + 'px',
            });
        }
    }

    function changeTextTransform(cap) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css('text-transform', cap);
        }
    }

    function changeTextDecoration(decoration) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css('text-decoration', decoration);
        }
    }

    function changeFontWeight(weight) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css('font-weight', weight);
        }
    }

    function changeFontStyle(style) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css('font-style', style);
        }
    }

    function changeFont(fontfamily) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css("font-family", fontfamily);
        }
    }

    function changeFontSize(size) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css("font-size", size);
        }
    }

    function changeTextColor(color) {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).css("color", color);
        }
    }

    function applyText(text) {
        var elementId = 'text' + $scope.textId++;
        var element = document.createElement('div');
        element.setAttribute('class', 'text');
        element.setAttribute('id', elementId);
        element.innerHTML = text;
        element.onclick = onSelectText;
        var parent = document.getElementById('composer');
        parent.appendChild(element);

        $(".text").draggable({containment: '#composer'});
        $(".text").resizable({containment: '#composer', animate: true});

        element.click();

        $scope.newText = '';

    }


    function getImageUrlFromPath(item) {
        return IMAGE_SERVER + '/' + item.url;
    }

    function hasNext() {
        return search.hasNext;
    }

    function hasPrev() {
        return search.hasPrev;
    }

    function nextPage() {
        if (search.hasNext) {
            search.page++;
            search.skip = search.page * search.limit;
            loadImages();
        }
    }

    function prevPage() {
        if (search.hasPrev) {
            search.page--;
            search.skip = search.page * search.limit;
            loadImages();
        }
    }

    function resetSearch() {
        search.hasPrev = false;
        search.hasNext = false;
        search.page = 0;
        search.skip = 0;
    }


    function loadImages() {
        console.log('loadImages called');
        var params = search;
        Remote.allImages(params, function (res) {
            $scope.images = res;

            if ($scope.images && $scope.images.length > 0 && ($scope.images.length % search.limit == 0)) {
                search.hasNext = true;
            } else {
                search.hasNext = false;
            }
            if (search.page <= 0) {
                search.hasPrev = false;
            } else {
                search.hasPrev = true;
            }
            //console.dir(search);
            //console.dir($scope.quotes);
        }, function (err) {

        });
    }

    function loadQuote() {
        if ($scope.quote && $scope.quote._id) {
            Remote.oneQuote($scope.quote, function (res) {
                console.log(res);
                $scope.quote = angular.merge($scope.quote, res);
            }, function (err) {
            });
        }
    }

    function initComposer() {
        var composer = document.getElementById("composer");
        var canvasBackground = document.getElementById('myCanvasBackground');
        var author = angular.element("#author");
        var quote = angular.element("#quote");
        var extra = angular.element("#extra");
        var canvas = angular.element("#extra");

        $scope.views.author = author;
        $scope.views.quote = quote;
        $scope.views.extra = extra;
        $scope.views.canvasBackground = canvasBackground;
        $scope.views.composer = composer;

        $scope.views.canvasBackground.width = $scope.views.composer.style.width = 512;
        $scope.views.canvasBackground.height = $scope.views.composer.style.height = 340;

        $scope.views.author.draggable({containment: '#composer'});
        $scope.views.author.resizable({containment: '#composer'});

        $scope.views.quote.draggable({containment: '#composer'});
        $scope.views.quote.resizable({containment: "#composer"});

        $scope.views.extra.draggable({containment: '#composer'});
        $scope.views.extra.resizable({containment: '#composer'});
    };

    function refreshComposer() {
        $scope.views.author.draggable("destroy");
        $scope.views.author.resizable("destroy")
        $scope.views.author.draggable({containment: '#composer'});
        $scope.views.author.resizable({containment: '#composer'});

        $scope.views.quote.draggable("destroy");
        $scope.views.quote.resizable("destroy")
        $scope.views.quote.draggable({containment: '#composer'});
        $scope.views.quote.resizable({containment: "#composer"});

        $scope.views.extra.draggable("destroy");
        $scope.views.extra.resizable("destroy")
        $scope.views.extra.draggable({containment: '#composer'});
        $scope.views.extra.resizable({containment: '#composer'});

    }

    function resetBackground() {
        $scope.views.canvasBackground.width = $scope.views.composer.style.width = 512;
        $scope.views.canvasBackground.height = $scope.views.composer.style.height = 340;
        changeBackgroundColor('#7eb300');
    }

    function changeBackgroundColor(color) {
        if ($scope.views.canvasBackground) {
            var context = $scope.views.canvasBackground.getContext('2d');
            context.beginPath();
            context.rect(0, 0, $scope.views.canvasBackground.width, $scope.views.canvasBackground.height);
            context.fillStyle = '' + color;
            context.fill();
            console.log($scope.views.composer);
        }
    }


    function downloadImage() {
        html2canvas(document.getElementById("composer"), {
            allowTaint: false,
            logging: true,
            onrendered: function (canvas) {
                var link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = 'Image.png';
                document.body.appendChild(link);
                link.click();
            }
        });

    }

    function loadBackgroundImages() {
        console.log('loadBackgroundImages called');
        nextPage();
    }


    function changeBackgroundImageUrl(url) {
        $scope.background.image.src = url;
    }


    function changeColor(color) {
        ctx.beginPath();
        ctx.rect(0, 0, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
        ctx.fillStyle = '' + color;
        ctx.fill();
    }

    function changeImageUrl(url) {
        $scope.background.image.src = url;
    }

    function imageLoaded() {
        $scope.background.dime.src.right = $scope.background.image.width;
        $scope.background.dime.src.bottom = $scope.background.image.height;
        /*ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
         $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
         */
        $("#sliderx").slider({
            min: 0,
            max: $scope.background.image.width - $scope.background.dime.dest.right,
            value: 1,
            slide: onSoliderX,
        });
        $("#slidery").slider({
            min: 0,
            max: $scope.background.image.height - $scope.background.dime.dest.bottom,
            value: 1,
            slide: onSliderY,
        });

        $scope.background.isFill = false;
        $scope.background.isFillX = false;
        $scope.background.isFillY = false;
        $scope.background.fill();

    }

    function onSoliderX(event, ui) {
        if ($scope.background.dime.src.right == $scope.background.image.width) {
            return;
        }

        $scope.background.dime.src.left = ui.value;
        ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
            $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
    }

    function onSliderY(event, ui) {
        if ($scope.background.dime.src.bottom == $scope.background.image.height) {
            return;
        }

        $scope.background.dime.src.top = ui.value;
        ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
            $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
    }


    function fill() {
        if ($scope.background.isFill) {
            $scope.background.dime.src.right = $scope.background.dime.dest.right;
            $scope.background.dime.src.bottom = $scope.background.dime.dest.bottom;
        } else {
            $scope.background.dime.src.left = 0
            $scope.background.dime.src.top = 0;
            $scope.background.dime.src.right = $scope.background.image.width;
            $scope.background.dime.src.bottom = $scope.background.image.height;
        }
        ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
            $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
        $scope.background.isFill = !$scope.background.isFill;
        $scope.background.isFillX = false;
        $scope.background.isFillY = false;
    }

    function fillX() {
        if ($scope.background.isFillX) {
            $scope.background.dime.src.right = $scope.background.dime.dest.right;
            $scope.background.dime.src.bottom = $scope.background.dime.dest.bottom;
        } else {
            $scope.background.dime.src.left = 0
            $scope.background.dime.src.right = $scope.background.image.width;
            $scope.background.dime.src.bottom = $scope.background.dime.dest.bottom;
        }
        ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
            $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
        $scope.background.isFillX = !$scope.background.isFillX;
        $scope.background.isFill = false;
        $scope.background.isFillY = false;

    }

    function fillY() {
        if ($scope.background.isFillY) {
            $scope.background.dime.src.right = $scope.background.dime.dest.right;
            $scope.background.dime.src.bottom = $scope.background.dime.dest.bottom;
        } else {
            $scope.background.dime.src.top = 0;
            $scope.background.dime.src.right = $scope.background.dime.dest.right;
            $scope.background.dime.src.bottom = $scope.background.image.height;
        }

        ctx.drawImage($scope.background.image, $scope.background.dime.src.left, $scope.background.dime.src.top, $scope.background.dime.src.right, $scope.background.dime.src.bottom,
            $scope.background.dime.dest.left, $scope.background.dime.dest.top, $scope.background.dime.dest.right, $scope.background.dime.dest.bottom);
        $scope.background.isFillY = !$scope.background.isFillY;
        $scope.background.isFill = false;
        $scope.background.isFillX = false;

    }

    function onSelectText() {
        if ($scope.selectedTextElement) {
            $($scope.selectedTextElement).removeClass("text-active");
        }
        $(this).addClass("text-active");
        $scope.selectedTextElement = this;

    }


}