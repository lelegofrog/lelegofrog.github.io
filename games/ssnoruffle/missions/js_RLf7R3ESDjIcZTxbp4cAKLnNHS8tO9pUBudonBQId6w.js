/*
This file is part of the Kaltura Collaborative Media Suite which allows users
to do with audio, video, and animation what Wiki platfroms allow them to do with
text.

Copyright (C) 2006-2008  Kaltura Inc.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/


// initModalBox called from gotoCW - to open the contribution wizard as an iFrame in the

// widget page

function kalturaInitModalBox ( url, options ) {
	var objBody = document.getElementsByTagName("body").item(0);

	// create overlay div and hardcode some functional styles (aesthetic styles are in CSS file)

	var objOverlay = document.createElement("div");

	objOverlay.setAttribute('id','kaltura_overlay');

	objBody.appendChild(objOverlay, objBody.firstChild);

	
	if (options)
	{
		if (options.width)
			width = options.width;
		if (options.height)
			height = options.height;
	} else {
		width = 680;
		height = 360;
	}


	// create modalbox div, same note about styles as above

	var objModalbox = document.createElement("div");

	objModalbox.setAttribute('id','modalbox');
	//objModalbox.setAttribute('style', 'width:'+width+'px;height:'+height+'px;margin-top:'+(0-height/2)+'px;margin-left:'+(0-width/2)+'px;');
	objModalbox.style.width = width+'px';
	objModalbox.style.height = height+'px';
	objModalbox.style.marginTop = (0-height/2)+'px';
	objModalbox.style.marginLeft = (0-width/2)+'px';
	

	// create content div inside objModalbox

	var objModalboxContent = document.createElement("div");

	objModalboxContent.setAttribute('id','mbContent');

	if ( url != null )

	{

		objModalboxContent.innerHTML = '<iframe id="kaltura_modal_iframe" scrolling="no" width="' + width + '" height="' + height + '" frameborder="0" src="' + url + '"/>';

	}

	objModalbox.appendChild(objModalboxContent, objModalbox.firstChild);

	

	objBody.appendChild(objModalbox, objOverlay.nextSibling);	

	

	return objModalboxContent;

}

function SendTopToNodePage(){

	window.top.location.href = node_url;

}

function SendTopToEntriesPage(){
  window.top.location.href = Drupal.settings.kaltura.gotoURL;
}



function closeEditorHandler() {
	kalturaCloseModalBox();
}

function kalturaCloseModalBox () {
	if ( this != window.top )

	{

		window.top.kalturaCloseModalBox();

		return false;

	}


	// TODO - have some JS to close the modalBox without refreshing the page if there is no need

	overlay_obj = document.getElementById("kaltura_overlay");

	modalbox_obj = document.getElementById("modalbox");

	overlay_obj.parentNode.removeChild( overlay_obj );

	modalbox_obj.parentNode.removeChild( modalbox_obj );

	

	return false;

}

function $id(x){ return document.getElementById(x); }

function kalturaRefreshTop () {
	if ( this != window.top )

	{

		window.top.kalturaRefreshTop();

		return false;

	}	

	window.location.reload(true);

}

function switch_to_exist_partner() {

	var href = location.href;

	tmp = href.replace('&register=no', '');

	href = tmp.replace('?register=no', '');

	if(href.indexOf('?') > 0)

		location.href = href + '&register=no'

	else

		location.href = href + '?register=no'

}

function switch_to_saas()
{

    var href = location.href;

	if(href.indexOf('?') > 0)
    {
        href = href + '&op=Continue%20>>';
    }
    else
    {
        href = href + '?op=Continue%20>>';
    }
    href = href + '&kaltura_registration_mode=1';

    location.href = href;
}

function switch_to_register() {

	var href = location.href;

	tmp = href.replace('&register=no', '');

	href = tmp.replace('?register=no', '');

	location.href = href;

}

KalturaThumbRotator = {



	slices : 16, // number of thumbs per video

	frameRate : 1000, // frameRate in milliseconds for changing the thumbs

	

	timer : null,

	slice : 0,

	img  : new Image(),

	

	thumbBase : function (o) // extract the base thumb path by removing the slicing parameters

	{

		var path = o.src;

		var pos = path.indexOf("/vid_slice");

		if (pos != -1)

			path = path.substring(0, pos);


		return path;

	},

	



	change : function (o, i) // set the Nth thumb, request the next one and set a timer for showing it

	{

		slice = (i + 1) % this.slices;



		var path = this.thumbBase(o);

		

		o.src = path + "/vid_slice/" + i + "/vid_slices/" + this.slices;

		this.img.src = path + "/vid_slice/" + slice + "/vid_slices/" + this.slices;



		i = i % this.slices;

		i++;

		

		this.timer = setTimeout(function () { KalturaThumbRotator.change(o, i) }, this.frameRate);

	},

	

	start : function (o) // reset the timer and show the first thumb

	{

		clearTimeout(this.timer);

		var path = this.thumbBase(o);

		this.change(o, 1);

	},



	end : function (o) // reset the timer and restore the base thumb

	{

		clearTimeout(this.timer);

		o.src = this.thumbBase(o);

	}

};

function remove_items_from_field(field_id) { document.getElementById(field_id).value = ''; }

function remove_item_from_field(field_id, entry_id, kaltura_server) {

	field_obj = document.getElementById(field_id);

	field_obj.value = field_obj.value.replace(entry_id, '');

	update_field_thumbs(field_obj, kaltura_server);

}

function get_title() {

	title = document.getElementById("edit-title").value;
	
	if (title != '') {return title;}
	else {return "My Remix"; }
	
}

function kaltura_activate_player(thumb_div, player_div) {

	document.getElementById(thumb_div).style.display = 'none';

	document.getElementById(player_div).style.display = 'block';

}

function update_field_thumbs(hidden_field_obj, kaltura_server) {

	entries = Array();

	entries = hidden_field_obj.value.split(',');

	target_div = window.top.document.getElementById(hidden_field_obj.id + '_thumbs_div');

	target_div.innerHTML = '<div class="title">Added Media:</div>';

	for(i=0;i<entries.length;i++) {

		if(entries[i].length > 1) {

			target_div.innerHTML += '<div class="kaltura_field_thumb"><img src="'+ kaltura_server +'/entry_id/'+ entries[i] +'" /><br />'+

				'<input type="button" onclick="remove_item_from_field(\''+hidden_field_obj.id+'\', \''+ entries[i] +'\', \''+ kaltura_server +'\');" class="remove_media" /></div>';

		}

	}

	target_div.innerHTML += '<div class="clear-block"></div>';

}

function kalturaUpdateMediaField(entryId, mediaType) {
  var mediaTypes = [];
  mediaTypes[1] = Drupal.t('Video');
  mediaTypes[2] = Drupal.t('Image');
  mediaTypes[5] = Drupal.t('Audio');

  jQuery("#" + Drupal.settings.kaltura.kcwField + "-entryid input").val(entryId);
  jQuery("#" + Drupal.settings.kaltura.kcwField + "-media-type input").val(mediaType);
  var t = '<div class="title">' + Drupal.t('Added @media', {'@media': mediaTypes[mediaType]}) + ' </div><div class="kaltura_field_thumb"><img src="' + Drupal.settings.kaltura.thumbnailBaseURL + '/entry_id/' + entryId + '"/><br/> <input type="button" title="' + Drupal.t('remove item') + '" class="remove_media" /></div>';
  jQuery("#"+ Drupal.settings.kaltura.kcwField + "-thumb-wrap").html(t);

  Drupal.attachBehaviors();
}

jQuery(document).ready(function() {
  if (window.top.document.getElementById("kaltura_modal_iframe")) {
    window.top.document.getElementById("kaltura_modal_iframe").className = "";
    window.top.document.getElementById("kaltura_modal_iframe").scrolling = "no";
  }
});
;
(function ($) {

Drupal.kaltura = Drupal.kaltura || {};

/**
 * Inserts SWF object into HTML element.
 */
Drupal.kaltura.insertSWF = function (htmlID, url, swfID, width, height, flashVars, wMode) {
  var swf = new SWFObject(url, swfID, width, height, "9", "#000000");

  if (wMode) {
    swf.addParam("wmode", wMode);
  }
  swf.addParam("flashVars", flashVars);
  swf.addParam("allowScriptAccess", "always");
  swf.addParam("allowFullScreen", "TRUE");
  swf.addParam("allowNetworking", "all");

  swf.write(htmlID);
};

/**
 * @todo: Add doc.
 */
Drupal.kaltura.changePlayer = function (vars, uiconf, change_dim) {
  var url = vars.replace_url.replace("##uiconf##", uiconf);

  var player_width = '0',
      player_height = '0';
  if (vars.site_players[uiconf] != undefined) {
    player_width = vars.site_players[uiconf].width;
    player_height = vars.site_players[uiconf].height;
  }
  if (player_width == '0') {
    player_width = vars.variable_width;
  }
  if (player_height == '0') {
    player_height = vars.variable_height;
  }

  Drupal.kaltura.insertSWF(vars.type + '_ph', url, vars.type + '_ph_player', player_width, player_height, '', 'opaque');

  if (change_dim) {
    $('input[data-kaltura-reflect-width-of-player="' + vars.id + '"]').val(player_width);
    $('input[data-kaltura-reflect-height-of-player="' + vars.id + '"]').val(player_height);
  }
};

  Drupal.behaviors.kaltura = {
    attach: function(context, settings) {
      settings.kaltura = settings.kaltura || {};

      $('.remove_media', context).click(function () {
        $(this).parents('.kaltura-thumb-wrap').nextAll().children('input:hidden').val('');
        $(this).parents('.kaltura-thumb-wrap').siblings('a').remove();
        $(this).parents('.kaltura-thumb-wrap').html('');
        });

      // Insert SWF objects into HTML.
      settings.kaltura.insertSWF = settings.kaltura.insertSWF || {};
      $.each(settings.kaltura.insertSWF, function (id, vars) {
        $('#' + id, context).once('kaltura-insert-swf', function () {
          Drupal.kaltura.insertSWF(id, vars.url, vars.swfID, vars.width, vars.height, vars.flashVars, vars.wMode);
        });
      });

      // Set and change player.
      settings.kaltura.changePlayer = settings.kaltura.changePlayer || {};
      $.each(settings.kaltura.changePlayer, function (id, vars) {
        vars.id = id;

        $('#' + id, context).once('kaltura-entry-widget', function () {
          Drupal.kaltura.changePlayer(vars, vars.saved_player);

          $(this).change(function () {
            Drupal.kaltura.changePlayer(vars, $(this).val(), 1);
          });
        });
      });
    }
  };
    Drupal.behaviors.kaltura_add = {
      attach: function (context, settings) {
        var mediaTypes = {};
        mediaTypes.Video = 1;
        mediaTypes.Image = 2;
        mediaTypes.Audio = 5;
        $('.kentry_add', context).click(function () {
          var field_name = $(this).attr('name');
          var entry_id = $(this).attr('id');
          var media_type = $(this).attr('rel');
          var mediaTypeId = mediaTypes[media_type];
          var src = $(this).parent().prevAll('.views-field-kaltura-thumbnail-url').find('img').attr('src');
          var t = '<div class="title">Added ' + media_type + ' </div><div class="kaltura_field_thumb"><img src="' + src + '"/><br/> <input type="button" title="remove item" class="remove_media" /></div>';
          var mtselect = "#" + field_name + "-media-type input";
          var etselect = "#" + field_name + "-entryid input";
          var thumb_select = "#" + field_name + "-thumb-wrap";
          $(etselect).val(entry_id);
          $(mtselect).val(mediaTypeId);
          $(thumb_select).html(t);
          Drupal.attachBehaviors();
          $('.close').triggerHandler('click');
          }
          );
          /*
           *$('#tab-kaltura_browse a').click(function () {
           *  $(".close").trigger("click");}
           *);
           */
        }
      };
      Drupal.behaviors.kaltura_roate = {
      attach: function (context, settings) {
      $('img.k-rotate').hover(function () {
        KalturaThumbRotator.start(this);},
        function () {
          KalturaThumbRotator.end(this);}
        );}
      };

      Drupal.behaviors.kaltura_prev_roate = {
      attach: function (context, settings) {
      $('.thumb-with-prev').hover(function () {
        var prev = $(this).children('img.k-preview');
        prev.show();
        KalturaThumbRotator.start(prev[0]);
        },
        function () {
          var prev = $(this).children('img.k-preview');
          prev.hide();
          KalturaThumbRotator.end(prev[0]);}
        );}
        };
          function tog (val) {
            switch (val) {
              case 'both':
                $('.details').show();
                $('.views-field-kaltura-thumbnail-url').show();
                break;

              case 'thumbs':
                $('.details').hide();
                $('.views-field-kaltura-thumbnail-url').show();
                break;

              case 'details':
                $('.details').show();
                $('.views-field-kaltura-thumbnail-url').hide();
                break;
            }
          }

      Drupal.behaviors.kaltura_entries = {
        attach: function (context, settings) {
          var current = $('#edit-view-opts').val();
          tog(current);
          $('#edit-view-opts').change(function () {
            var val = this.value;
            tog(val);
          });
        }
      };
        /*
         *Drupal.behaviors.kaltura_search = {
         *  attach: function (context, settings) {
         *      var edit = $('.view-kaltura-existing #edit-kaltura-text, .view-kaltura-list-entries #edit-kaltura-text');
         *      edit.val('Search');
         *      edit.focus( function () {
         *        if ($(this).val() === 'Search') {
         *          $(this).val('');
         *        }
         *        });
         *      edit.blur( function () {
         *        if ($(this).val() === '') {
         *            $(this).val('Search');
         *          }
         *        });
         *    }
         *  };
         */

  // Hide these in a ready to ensure that Drupal.ajax is set up first.
  $(function() {
    if (Drupal.ajax != undefined) {
      Drupal.ajax.prototype.commands.kalturaCallFunction = function(ajax, data, status) {
        var fn = window[data['function']];
        fn.apply(null, data.arguments);
      };
    }
  });
})(jQuery);
;
(function ($) {

  // Alert Messages

  Drupal.behaviors.parentAlertMessages = {
    attach: function(context, settings) {
      $('.alert-close-btn').click(function() {
        var userState = $(this).parent().attr('data-user-state');
        var cookieName = 'sesamestreet_parent_message_' + userState + '_viewed';

        Cookies.set(cookieName, true);

        $(this).parent().hide();
      });
    }
  };

}(jQuery));
;
