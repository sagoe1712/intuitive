"use strict";

require(["jquery"], function($) {
    require(["framework7"], function(Framework7) {
        require(["dpanels"], function(dpanels) {
            // Initialize your app
            var theApp = new window.Framework7({
                init        : false,
                cache       : false,
                material    : true,
                pushState   : true,
                swipeout    : false,
                pushStateSeparator: '#/',
                hideNavbarOnPageScroll: true,
                showBarsOnPageScrollEnd: true,
                showBarsOnPageScrollTop: true,
                onAjaxStart: function () {
                    var _loading_screen = $$('.tc-loading-screen');
                    _loading_screen.toggleClass('on');
                },
                onAjaxComplete: function () {
                    var _loading_screen = $$('.tc-loading-screen');
                    _loading_screen.toggleClass('on');
                }
            });

            // Export selectors engine
            var $$ = Dom7;

            // Add view
            var mainView = theApp.addView('.view-main', {});

            /**
             * Page Initialization
             *
             * @summary Have to write all page related javascript in here,
             *          Make sure @theApp's init set to false above.
             *          Make sure the element you process exist on page.
             *          Will make this code work after with theApp.init()
             *
             * @docs    http://www.idangero.us/framework7/docs/page-callbacks.html
             */
            theApp.onPageInit('*', function (page) {


                /**
                 * Transparent Navbar Coloring
                 *
                 * @summary In case you use transparent nav bar on the page,
                 *          When you leave the top of the page, this will add coloring.
                 *          When you get to top of the page it will remove color again.
                 */
                var _navbar_transparent = $$('.navbar.transparent');
                if( _navbar_transparent.length )
                    $$('.page-content').scroll(function () {
                        var inside_header = ($$(this).scrollTop() <= 60);

                        if ( inside_header == true )
                            _navbar_transparent.removeClass('primary-bg-temporary');
                        else
                            _navbar_transparent.addClass('primary-bg-temporary');

                    });

                /**
                 * Header Search
                 *
                 * @summary Controls the visibility of the search bar on the nav bar.
                 *          You can disable it by removing any related HTML or the code below.
                 */
                var _search_toggler = $$('.header-search-icon'),
                    _header_search  = $$('.tc-header-search');

                if( _header_search.length   > 0 &&
                    _search_toggler.length  > 0 )

                    _search_toggler.on('click', function () {
                        _header_search.toggleClass('show');
                        $$(this).toggleClass('show');
                    });

                /**
                 * Photo/Gallery Browser
                 *
                 * @summary Collects the images inside gallery caption and creates a photo browser
                 *          Please make sure you use the following markup.
                 *          Images can be populated as many as you want.
                 *          Can be used for one image only.
                 *
                 * @docs    http://www.idangero.us/framework7/docs/photo-browser.html
                 *
                 * @markup  <div data-gallery-id="UNIQUE_NAME">
                                <img src="PATH_TO_LIST_IMAGE" data-big-src="PATH_TO_BIG_IMAGE" data-caption="CAPTION_TEXT"/>
                                <img src="PATH_TO_LIST_IMAGE" data-big-src="PATH_TO_BIG_IMAGE" data-caption="CAPTION_TEXT"/>
                                <img src="PATH_TO_LIST_IMAGE" data-big-src="PATH_TO_BIG_IMAGE" data-caption="CAPTION_TEXT"/>
                                ...
                            </div>
                 */
                var _photo_browser_gallery = $$('[data-gallery-id]');
                _photo_browser_gallery.each(function () {
                    var _galleries = [];

                    $$(this).find('[data-big-src]').each(function () {
                        _galleries.push({
                            url     : $$(this).data('big-src'),
                            caption : $$(this).data('caption')
                        });
                    });

                    var myPhotoBrowserPopupDark = theApp.photoBrowser({
                        photos : _galleries,
                        theme: 'dark',
                        type: 'standalone'
                    });

                    $$(this).find('[data-big-src]').on('click', function () {
                        myPhotoBrowserPopupDark.open();
                    });
                });

                /**
                 * Filterable Grid
                 *
                 * @summary Follow the markup below.
                 *          Check the @docs for other grid options,
                 *          You can use as many columns in a row as you want, not restricted to 100.
                 *          Filtering is optional.
                 *
                 *
                 * @docs    http://www.idangero.us/framework7/docs/_FEATURES/grid.html
                 *
                 * @markup  <div class="row">
                                 <div class="col-100">
                                     <div class="content-block-inner">
                                         <div class="tc-filters clearfix">
                                             <span>Filter:</span>
                                             <a href="#" data-filter="*" class="active">All</a>
                                             <a href="#" data-filter=".design">Design</a>
                                             <a href="#" data-filter=".development">Development</a>
                                         </div>
                                     </div>
                                 </div>
                            </div>

                             <div class="row tc-isotope">
                                 <div class="tc-isotope-item col-50 tablet-33 design">...</div>
                                 <div class="tc-isotope-item col-50 tablet-33 design">...</div>
                                 <div class="tc-isotope-item col-50 tablet-33 design">...</div>
                                 ...
                             </div>
                 */
                var _isotope = $('.tc-isotope');
                if( _isotope.get(0) )

                    require(["isotope",'imagesLoaded'], function(Isotope,imagesLoaded) {
                        _isotope.imagesLoaded(function () {
                            _isotope.each(function () {
                                var ___this     = $(this),
                                    __filters   = ___this.prev().find('a');

                                var iso = new Isotope( ___this.get(0), {
                                    itemSelector: '.tc-isotope-item',
                                    layoutMode: 'fitRows'
                                });

                                __filters.on( 'click', function(e) {
                                    e.preventDefault();
                                    var that        = $(this),
                                        filterValue = that.data('filter');

                                    if( !that.hasClass('active') ){
                                        __filters.filter(function(){
                                            return $(this).hasClass('active');
                                        }).removeClass('active');

                                        that.addClass('active');
                                        iso.arrange({
                                            filter: filterValue
                                        });
                                    }
                                });
                            });
                        });
                    });



                /**
                 * Countdown
                 *
                 * @summary         A simple Countdown plugin
                 * @data-end-date   Use the Month/Day/Year format
                 *
                 *
                 * @docs    http://hilios.github.io/jQuery.countdown/
                 *
                 * @markup  <div class="tc-countdown horizontal"
                                data-end-date="12/30/2015"
                                data-days-label="Days"
                                data-hours-label="Hours"
                                data-minutes-label="Minutes"
                                data-seconds-label="Seconds"
                            ></div>
                 */
                var _countdown = $('.tc-countdown');

                if( _countdown.get(0) )
                    require(['countdown'], function(countdown) {
                        function formatter(event,el){
                            var days = event.strftime('<div><h4>%D</h4><span>'+el.data('days-label')+'</span></div>'),
                                hours = event.strftime('<div><h4>%H</h4><span>'+el.data('hours-label')+'</span></div>'),
                                minutes = event.strftime('<div><h4>%M</h4><span>'+el.data('minutes-label')+'</span></div>'),
                                seconds = event.strftime('<div><h4>%S</h4><span>'+el.data('seconds-label')+'</span></div>');

                            return days+hours+minutes+seconds;
                        }

                        _countdown.each(function () {
                            var __this      = $(this),
                                __endDate   = __this.data('end-date');

                            __this.countdown(__endDate, function(event) {
                                $(this).html(formatter(event,__this));
                            });
                        });
                    });



                /**---------------------
                 *
                 * Google Maps
                 *
                 *---------------------**/
                var _map = $('.tc-map');
                if( _map.get(0) ){

                    require(['async!http://maps.google.com/maps/api/js?sensor=true'], function() {

                        function initMap(el) {
                            var myLatLng = {lat: el.data('lat'), lng: el.data('lng')};

                            // Create a map object and specify the DOM element for display.
                            var map = new google.maps.Map(el.get(0), {
                                center: myLatLng,
                                zoom: 15,
                                scrollwheel: false,
                                draggable: false
                            });

                            // Create a marker and set its position.
                            var marker = new google.maps.Marker({
                                map: map,
                                position: myLatLng,
                                draggable: false,
                                title: "We're Here!"
                            });
                        }

                        _map.each(function(){
                            var _this = $(this);
                            initMap(_this);
                        });
                    });
                }



                /**---------------------
                 *
                 * PHP Ajax Contact Form
                 *
                 *---------------------**/
                var _contact_forms = $('.tc-contact-form');
                _contact_forms.each(function () {
                    var _this   = $(this),
                        _submit = _this.find('[type=submit]');

                    _this.bind('submit', function(){
                        _submit.attr('disabled','disabled');

                        $.ajax({
                            type: "POST",
                            url: "mail.php",
                            data: _this.serialize(),
                            success: function(returnedInfo){
                                if( returnedInfo == 0 ){
                                    theApp.addNotification({
                                        message: 'Message Sent!'
                                    });
                                }else{
                                    theApp.addNotification({
                                        message: 'Our mail servers are currently down, please try again later!'
                                    });
                                }
                                _submit.removeAttr('disabled');
                            }
                        });
                        return false;
                    });
                });



                /**---------------------
                 *
                 * Iframe Placing
                 *
                 *---------------------**/
                var _embedResponsives = $('.embed-responsive.will-load');
                if( _embedResponsives.get(0) )
                    _embedResponsives.each(function(){

                        var _this = $(this),
                            _img = _this.children('img'),
                            _iframeSrc = _img.data('iframe-src');

                        _this.append('<iframe src="'+_iframeSrc+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                        _img.remove();
                        _this.removeClass('will-load');

                    });



                // Default
                var calendarDefault = theApp.calendar({
                    input: '#ks-calendar-default',
                });
                // With custom date format
                var calendarDateFormat = theApp.calendar({
                    input: '#ks-calendar-date-format',
                    dateFormat: 'DD, MM dd, yyyy'
                });
                // With multiple values
                var calendarMultiple = theApp.calendar({
                    input: '#ks-calendar-multiple',
                    dateFormat: 'M dd yyyy',
                    multiple: true
                });
            });

            theApp.onPageInit('cart', function (page) {
                /**---------------------
                 *
                 * Cart Item Quantity
                 *
                 *---------------------**/
                $('.quantity').each(function () {
                    var _increase = $(this).find('.increase'),
                        _decrease = $(this).find('.decrease'),
                        _quantity = $(this).find('input');

                    _increase.on('click', function (e) {
                        e.preventDefault();

                        var _quantity_value = parseInt(_quantity.val());

                        _quantity.val( _quantity_value + 1 );
                    });

                    _decrease.on('click', function (e) {
                        e.preventDefault();

                        var _quantity_value = parseInt(_quantity.val());

                        _quantity.val( Math.max( 1, (_quantity_value - 1) ) );
                    });
                });
            });

            theApp.init();
        });
    });
});


