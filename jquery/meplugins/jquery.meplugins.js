
/**
 *	ME-Plugins - Jquery Plugin - createdate 26.10.2011
 *	benötigt jquery + jquery tools
 *	Author: Benedict Reuthlinger
 *	Marschall Electronics GmbH & Co KG
 *	Garmisch-Partenkirchen
 */
(function($)
{
  /**
   *
   * me_equalHeight: Höhe mehrerer Boxen angleichen, maßgeblich ist die höchste Box.
   *
   * @example:
   * <div class="row">
   *   <div class="equalheight"></div>
   *   <div class="equalheight"></div>
   * </div>
   * $('.row').me_equalHeight();
   *
   * @param options : boxselector : Der Selektor anhand dem die Höhe gesetzt werden soll. Standard-Selektor: .equalheight
   *
   */
  $.fn.me_equalHeight = function(options)
  {
    var defaults = {
      boxselector : '.equalheight'
    };
    var options = $.extend(defaults, options);

    this.each(function(idx, val)
    {
      var boxselector = $(val).find(options.boxselector);
      var maxHeight = 0;
      var $this = $(boxselector);

      $this.each( function() {
        var height = $(this).innerHeight();

        if (height > maxHeight)
          maxHeight = height;
      });

      return $this.css('height', maxHeight);
    });
  };

  /**
   * Check all of a Checkboxlist
   * @param check Object($(this))
   *
   * @summary
   * id="selectall" feuert den Funktionsaufruf
   * data-ident="clientselect" = Identifier (class der anderen checkboxen)
   *
   * @example
   * <input type="checkbox" id="selectall" data-ident="clientselect" name="selall" title="Check ALL">
   * loop
   * <input type="checkbox" class="clientselect" name="toToggle" value="">
   * /loop
   *
   // Toggle ALL Checkboxes
   $("input#selectall").change(function () {
			$(this).selectAllToggle();
		});
   *
   */
  $.fn.me_selectAllToggle = function()
  {
    var check = $(this);
    var ident = check.data('ident');
    var state = check.prop('checked');

    $("input." + ident).each(function () {
      $(this).prop('checked', state);
    });
  };

  /**
   *
   * Zwei Selects: Einträge können von einem ins andere geklickt werden
   * @example
   * $('[id^=twoselect]').me_twoselect();

   <table class="maintbl fixlayout" cellpadding="0" cellspacing="0" id="twoselect1">
   <tr>
   <td width="50%" style="padding:10px;">
   <span style="font-size:10px;">Verfügbare Produkte: </span><br />
   <select class="leftselect selectbox1" name="leftuserselect[]" size="5" multiple="multiple">
   <mecms module="mod_selectfield" type="create_options" query="SELECT p.id as idfield, p.bezeichnung as displayfield FROM mod_shop_produkte as p">
   <option value="<mecms module="mod_selectfield" type="getoptionvalue" />"><mecms module="mod_selectfield" type="getoptiondisplay" /></option>
   </mecms>
   </select>
   </td>
   <td style="padding:10px;" width="45" align="center">
   <input class="leftbtn" type="button" name="leftbut_clid" value="&lt;" />
   <input class="rightbtn" type="button" name="rightbut_clid" value="&gt;" />
   </td>
   <td width="50%" style="padding:10px;">
   <span style="font-size:10px;">Produkt zugeteilt:</span><br />
   <select class="rightselect selectbox1" name="rightproduktselect[]" size="5" multiple="multiple">
   </select>
   </td>
   </tr>
   </table>

   *
   */
  $.fn.me_twoselect = function(options)
  {
    var defaults =
      {
        optleftbtn : '.leftbtn',
        optrightbtn : '.rightbtn',
        optleftselect : '.leftselect',
        optrightselect : '.rightselect',
        formselector : 'form'
      };

    var _self = this;
    var options = $.extend(defaults, options);

    this.each(function(idx, val)
    {
      var leftbtn = $(val).find(options.optleftbtn);
      var rightbtn = $(val).find(options.optrightbtn);
      var leftselect = $(val).find(options.optleftselect);
      var rightselect = $(val).find(options.optrightselect);
      var form = $(options.formselector);

      leftbtn.bind("click", function()
      {
        moveItems(rightselect, leftselect);
      });
      rightbtn.bind("click", function()
      {
        moveItems(leftselect, rightselect);
      });

      leftselect.bind("dblclick", function()
      {
        moveItems(leftselect, rightselect);
      });
      rightselect.bind("dblclick", function()
      {
        moveItems(rightselect, leftselect);
      });

      // Markieren beim submit des forms
      form.submit(function()
      {
        for (i = 0; i < rightselect[0].options.length; i++)
        {
          rightselect[0].options[i].selected = true;
        }

        return true;
      });
    });

    var moveItems = function(sourceList, destinationList)
    {
      sourceList = sourceList[0];
      destinationList = destinationList[0];

      itemFound = true;
      while (itemFound == true)
      {
        itemFound = false;
        for (var i = 0; i < sourceList.length; i++)
        {
          if (sourceList[i].selected)
          {
            NewEntry = new Option(sourceList[i].text,sourceList[i].value,false,true);
            destinationList[destinationList.length] = NewEntry;
            sourceList[i]=null;
            itemFound = true;
          }
        }
      }
    }
  };

  /**
   *
   * me_formatCurrency
   */
  $.fn.me_formatCurrency = function(settings) {
    settings = jQuery.extend({
      name: "formatCurrency",
      useHtml: false,
      symbol: '$',
      global: true
    }, settings);

    return this.each(function() {
      var num = "0";
      num = $(this)[settings.useHtml ? 'html' : 'val']();
      num = num.replace(/\$|\,/g, '');
      if (isNaN(num))
        num = "0";
      sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * 100 + 0.50000000001);
      cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10)
        cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));

      $(this)[settings.useHtml ? 'html' : 'val'](((sign) ? '' : '-') + settings.symbol + num + '.' + cents);
    });
  };

  /**
   *
   * Remove all non numbers from text
   */
  $.fn.toNumber = function(settings) {
    settings = jQuery.extend({
      name: "toNumber",
      useHtml: false,
      global: true
    }, settings);

    return this.each(function() {
      var method = settings.useHtml ? 'html' : 'val';
      $(this)[method]($(this)[method]().replace(/[^\d\.]/g, ''));
    });
  };

  /**
   *
   * me_placeholder
   */
  $.me_placeholder = function(options)
  {
    var _self = this;
    //var options = $.extend(defaults, options);

    // Input
    $("input[placeholder]").each(function()
    {
      if ($(this).attr("placeholder") != "")
      {
        if ($(this).val() == "")
        {
          $(this).val($(this).attr("placeholder"));
          $(this).addClass("placeholder");
        }
        $(this).focus(function()
        {
          if ($(this).hasClass("placeholder"))
          {
            $(this).val("");
            $(this).removeClass("placeholder");
          }
        });
        $(this).blur(function()
        {
          if ($(this).val() == "")
          {
            $(this).val($(this).attr("placeholder"));
            $(this).addClass("placeholder");
          }
        });
      }
    });

    // Textarea
    $("textarea[placeholder]").each(function()
    {
      if ($(this).attr("placeholder") != "")
      {
        var ph = $(this).attr("placeholder");

        if ($(this).text() == "")
        {
          ph = ph.replace(/\\r/g, String.fromCharCode(13));
          ph = ph.replace(/\\n/g, String.fromCharCode(13));
          $(this).text(ph);
          $(this).addClass("placeholder");
        }
        $(this).focus(function()
        {
          if ($(this).hasClass("placeholder"))
          {
            $(this).text("");
            $(this).removeClass("placeholder");
          }
        });
        $(this).blur(function()
        {
          if ($(this).text() == "")
          {
            ph = ph.replace(/\\r/g, String.fromCharCode(13));
            ph = ph.replace(/\\n/g, String.fromCharCode(13));
            $(this).text(ph);
            $(this).addClass("placeholder");
          }
        });
      }
    });

  };

  /**
   *
   * Preload Images
   */
  $.me_image_preload = function(options)
  {
    var defaults =
      {
        imgs : new Array()
      };

    var _self = this;
    var options = $.extend(defaults, options);

    var hiddencontainer = $('body').append('<div id="imghidden" style="display:none"></div>').children('#imghidden');

    for (var i = 0; i < options.imgs.length; i++)
    {
      $('<img />').attr('src', options.imgs[i]).appendTo(hiddencontainer);
    }
  };

  /**
   *
   * Image Rotate
   *
   * @example:

   // Imagerotate
   $('div.slider > div.slideitems').me_image_rotate({
			autoslide: true
		});

   <div class="slideshow1">
   <div class="slider_maske">
   </div>
   <div id="slidebuttons" class="sliderbuttons">
   <button class="prev" id="slideprevbtn"></button>
   <button class="next" id="slidenextbtn"></button>
   </div>
   <div class="slidetextboxes">
   <div class="slidetextbox" style="display:none;">
   <h1>Slide 1</h1>
   </div>
   <div class="slidetextbox" style="display:none;">
   <h1>Slide 2</h1>
   </div>
   <div class="slidetextbox" style="display:none;">
   <h1>Slide 3</h1>
   </div>
   </div>
   <div id="slidedots" class="slidedots">
   <button>&#0149;</button>
   <button>&#0149;</button>
   <button>&#0149;</button>
   </div>
   <div class="slider">
   <div class="slideitems">
   <div class="img" style="background-image:none;">
   <img alt="Slideshow-Image" src="http://www.gemeinde-saulgrub.de/mediacenter/1239/980/257/1/0/0/0/Hintere+Feld_0026.JPG" />
   </div>
   <div class="img" style="background-image:none;">
   <img alt="Slideshow-Image" src="http://www.gemeinde-saulgrub.de/mediacenter/1246/980/257/1/0/0/0/Ansicht+Kirche+Saulgrub+2014+Bild+1_bea.jpg" />
   </div>
   <div class="img" style="background-image:none;">
   <img alt="Slideshow-Image" src="http://www.gemeinde-saulgrub.de/mediacenter/339/980/257/1/0/0/0/DSC03382+Tiefsee.JPG" />
   </div>
   </div>
   </div>
   </div>
   *
   */
  $.fn.me_image_rotate = function(options)
  {
    var defaults =
      {
        divbuttonsid : '#slidebuttons',
        nextbuttonid : '#slidenextbtn',
        prevbuttonid : '#slideprevbtn',
        divslidedots : '#slidedots',
        divslidetext : '.slidetextboxes',

        autoslide : false,
        autoslide_speed : 7000,
        animation_speed : 2000,
        animation_type : "fade"
      };

    var _self   = this;
    var options = $.extend(defaults, options);

    var currentimgindex = 0;
    var nextimgindex    = 0;
    var imagecount      = 0;

    /**
     * initialisierung
     */
    var init = function()
    {
      imagecount = _self.children('div').length

      if (imagecount <= 0)
        return false;

      // Bilder ausblenden
      _self.children('div').each(function(index, value)
      {
        if (index > 0)
          $(value).fadeTo(0, 0);
      });

      // Eventhandler Buttons
      $(options.divbuttonsid).children('button' + options.nextbuttonid).each(function(index, value)
      {
        $(value).click(function()
        {
          onNextButton();
        });
      });
      $(options.divbuttonsid).children('button' + options.prevbuttonid).each(function(index, value)
      {
        $(value).click(function()
        {
          onPrevButton();
        });
      });

      // Eventhandler Dots
      $(options.divslidedots).children('button').each(function(index, value)
      {
        $(value).click(function()
        {
          onPressDot(index);
        });
      });

      // Ersten Dot
      var dots = $(options.divslidedots).children('button');
      if (dots.length > 0)
        $(dots[0]).addClass('active');

      // Slidetextboxes ausblenden
      var stb = $(options.divslidetext);
      if (stb.length > 0)
      {
        stb.each(function(index1, value1)
        {
          $(value1).children('div').each(function(index2, value2)
          {
            $(value2).hide();

            if (index2 == 0)
              $(value2).show();
          });
        });
      }

      // Autoslide
      if (options.autoslide)
      {
        startautoslide();
      }
    };

    /**
     * onNextButton
     */
    var onNextButton = function()
    {
      stopautoslide();
      nextImage();
    };

    /**
     * onPrevButton
     */
    var onPrevButton = function()
    {
      stopautoslide();
      prevImage();
    };

    /**
     * onPressDot-Button
     */
    var onPressDot = function(index)
    {
      stopautoslide();
      vaImage(index);
    };

    /**
     * Blendet divs ein/aus
     */
    var loadImage = function()
    {
      _self.children('div').each(function(index, value)
      {
        if (index == currentimgindex)
        {
          hideElement();
        }
      });
      _self.children('div').each(function(index, value)
      {
        if (index == nextimgindex)
        {
          showElement();
        }
      });
    };

    /**
     * showElement
     */
    var showElement = function()
    {
      var eles = _self.children('div');
      var dots = $(options.divslidedots).children('button');
      var stb  = $(options.divslidetext);

      // Slideimage
      switch (options.animation_type)
      {
        case "fade":
          $(eles[nextimgindex]).fadeTo(options.animation_speed, 1);
          break;
        case "slideDown":
          //$(eles[nextimgindex]).slideDown(options.animation_speed);
          break;
        case "slideUp":
          //$(eles[nextimgindex]).slideUp(options.animation_speed);
          break;
        case "slideLeft":
          $(eles[nextimgindex]).fadeTo(options.animation_speed, 1);
          //$(eles[nextimgindex]).show("slide", { direction: "left" }, options.animation_speed);
          break;
        case "straight":
          $(eles[nextimgindex]).fadeTo(0, 1);
          break;
      }

      // Slidetext
      stb.each(function(index1, value1)
      {
        $(value1).children('div').each(function(index2, value2)
        {
          if (index2 == nextimgindex)
            $(value2).show();
          //$(value2).fadeTo(500, 1);
        });
      });

      // Dots
      $(dots[nextimgindex]).addClass('active');

      currentimgindex = nextimgindex;
    };

    /**
     * hideElement
     */
    var hideElement = function()
    {
      var eles = _self.children('div');
      var dots = $(options.divslidedots).children('button');
      var stb  = $(options.divslidetext);

      // Slideimage
      switch (options.animation_type)
      {
        case "fade":
          $(eles[currentimgindex]).fadeTo(options.animation_speed, 0);
          break;
        case "slideDown":
          //$(eles[currentimgindex]).slideDown(options.animation_speed);
          break;
        case "slideUp":
          //$(eles[currentimgindex]).slideUp(options.animation_speed, 0);
          break;
        case "slideLeft":
          $(eles[currentimgindex]).animate({opacity: 0.0, left:"-1000px"}, options.animation_speed);
          //$(eles[currentimgindex]).show("slide", { direction: "left" }, options.animation_speed);
          break;
        case "straight":
          $(eles[currentimgindex]).fadeTo(0, 0);
          break;
      }

      // Slidetext
      stb.each(function(index1, value1)
      {
        $(value1).children('div').each(function(index2, value2)
        {
          if (index2 == currentimgindex)
            $(value2).hide();
          //$(value2).fadeTo(500, 0);
        });
      });

      // Dots ausblenden
      $(dots[currentimgindex]).removeClass('active');
    };

    /**
     * Beliebiges Element einblenden
     */
    var vaImage = function(index)
    {
      nextimgindex = index;

      // Load Image + Dots
      loadImage();
    };

    /**
     * Nächstes Element einblenden
     */
    var nextImage = function()
    {
      nextimgindex = getnextIndex(currentimgindex);

      // Load Image + Dots
      loadImage();
    };

    /**
     * Vorgänger-Element einblenden
     */
    var prevImage = function()
    {
      nextimgindex = getprevIndex(currentimgindex)

      // Load Image + Dots
      loadImage();
    };

    /**
     * Index vom Nächsten Element ermitteln
     */
    var getnextIndex = function(nindex)
    {
      if (nindex == imagecount - 1)
      {
        return 0;
      }
      else
      {
        return nindex + 1;
      }
    };

    /**
     * Index vom Vorgänger-Element ermitteln
     */
    var getprevIndex = function(nindex)
    {
      if (nindex == 0)
      {
        return imagecount - 1;
      }
      else
      {
        return nindex - 1;
      }
    };

    /**
     * Autoslide starten
     */
    var startautoslide = function()
    {
      options.autoslide = true;
      window.setTimeout(autoslide, options.autoslide_speed);
    };

    /**
     * Autoslide anhalten
     */
    var stopautoslide = function()
    {
      options.autoslide = false;
    };

    /**
     * autoslide ausführen
     */
    var autoslide = function()
    {
      if (options.autoslide == false)
        return;

      nextImage();
      window.setTimeout(autoslide, options.autoslide_speed);
    };

    init();

    //this.data('me_image_rotate', this);
    return this;
  };

})( jQuery );






