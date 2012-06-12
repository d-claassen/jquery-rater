/**
 *  jQuery plugin which extends the default jQuery UI slider
 *
 */

(function($) {

	$.fn.rater = function( options ) {
		var positions = [ 'above', 'after', 'below', 'before' ];
		var styles = [ 'separate', 'internal', 'handle' ];
		var settings = {
			position: 'above',
			style: 'internal'
		};
		
		if( !options )
		{
			options = [];
		}
		
		settings = $.extend( settings, options );
		
		return this.each(function() {
			var mySettings = $.extend( {}, settings );
			var div;
			var $parent;
			var that = this;
			var $this = $( this );

			for( var setting in mySettings )
			{
				if( typeof mySettings[ setting ] === 'function' )
				{
					mySettings[ setting ] = mySettings[ setting ].apply( this );
				}
			}

			$this.slider( options );
			
			if( mySettings.style === 'separate' )
			{
				$parent = $( '<div></div>' );
				$parent.insertBefore( $this );
				$this.appendTo( $parent );
				div = $( '<div></div>' );
				switch( mySettings.position )
				{
					case 'above':
					case 'before':
						div.insertBefore( this );
						break;
					case 'after':
					case 'below':
					default:
						div.insertAfter( this )
				}
			}

			$this.on( 'slide', function( event, ui ) {
				var min = $this.slider( 'option', 'min' );
				var max = $this.slider( 'option', 'max' );
				ui.value = ui.value < min ? min : ui.value > max ? max : ui.value;
				
				// ui.value should be between the hsl range from 0 - 120
				var color = hsl2rgb( ( ui.value - min ) * ( 120 / ( max - min ) ), 100, 55 );
				if( mySettings.style === 'handle' )
				{
					div = $( ui.handle ).css( 'background-image', 'none' );
				}
				else if( mySettings.style === 'internal' )
				{
					div = $this.css( 'background-image', 'none' );
				}
				div.css( 'background-color', 'rgb( '+Math.round(color.r)+', '+Math.round(color.g)+', '+Math.round(color.b)+' )');
			} );
			var oldValue;
			$this.on( 'slidechange', function( event, ui )
			{
				var newValue = ui.value;
				oldValue = ui.value;
			});
			
			if (mySettings.style === 'separate')
			{
				div.css( 'background-image', 'none' )
					.addClass( 'ui-widget ui-widget-content ui-corner-all' );
				if ( $this.slider( "option", "orientation" ) === 'vertical' )
				{
					div.addClass( 'ui-slider-vertical' );
					div.css( 'display', 'inline-block' );
					$this.css( 'display', 'inline-block' );
				}
				else
				{
					div.addClass( 'ui-slider-horizontal' );
				}
			}
		});
	};
	
	function hsl2rgb(h, s, l)
	{
		var m1, m2, hue;
		var r, g, b
		s /= 100;
		l /= 100;
		if( s === 0 )
		{
			r = g = b = ( l * 255 );
		}
		else
		{
			if( l <= 0.5 )
			{
				m2 = l * ( s + 1 );
			}
			else
			{
				m2 = l + s - l * s;
			}
			m1 = l * 2 - m2;
			hue = h / 360;
			r = HueToRgb( m1, m2, hue + 1 / 3 );
			g = HueToRgb( m1, m2, hue );
			b = HueToRgb( m1, m2, hue - 1 / 3 );
		}
		return {
			r: r,
			g: g,
			b: b
		};
	}

	function HueToRgb( m1, m2, hue )
	{
		var v;
		if( hue < 0 )
		{
			hue += 1;
		}
		else if( hue > 1 )
		{
			hue -= 1;
		}

		if( 6 * hue < 1 )
		{
			v = m1 + ( m2 - m1 ) * hue * 6;
		}
		else if( 2 * hue < 1 )
		{
			v = m2;
		}
		else if( 3 * hue < 2 )
		{
			v = m1 + ( m2 - m1 ) * ( 2 / 3 - hue ) * 6;
		}
		else
		{
			v = m1;
		}

		return 255 * v;
	}
})(jQuery);