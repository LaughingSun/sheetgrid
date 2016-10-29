"use strict";

class SheetGrid {
  
  constructor ( conf, width, height ) {
    this.configure( conf || {}, width, height )
  }
  
  configure ( conf, width, height ) {
    var $ = this
        , p = $.sheetPadding instanceof Object
            || ($.sheetPadding = {})
        , m = $.cellMargin instanceof Object
        || ($.cellMargin = {})
        , c, i, t
        ;
    
    $.scaleX = (i = parseFloat(conf.scaleX
        || conf.scale)) ? i : 1;
    $.scaleY = (i = parseFloat(conf.scaleY
        || $.scaleX)) ? i : 1;
    
    if ( typeof conf.verticalIndexing === 'string' ) {
      t = conf.verticalIndexing.toLowerCase( );
      $.verticalIndexing = ( t[0] === 't'
          || !! parseInt( t ) )
    } else {
      $.verticalIndexing = !! conf.verticalIndexing
    }
    
    if ( width ) {
      if ( width instanceof Object ) {
        $.sheetWidth = parseInt( width.width );
        $.sheetHeight = parseInt( width.height );
      } else {
        $.sheetWidth = parseInt( width );
        $.sheetHeight = parseInt( height );
      }
    }
    $.sheetWidth || ($.sheetWidth = conf.sheetWidth);
    $.sheetHeight || ($.sheetHeight = conf.sheetHeight
        || $.sheetWidth);
    
    if ( (c = conf.sheetPadding) instanceof Object ) {
      p.top = isNaN(i = parseInt(c.top)) ? 0 : i;
      p.right = isNaN(i = parseInt( c.right ))
          ? c.top : i;
      p.bottom = isNaN(i = parseInt( c.bottom ))
          ? c.top : i;
      p.left = isNaN(i = parseInt( c.left ))
          ? c.left : i;
    } else {
      p.top = p.right = p.bottom = p.left
          = isNaN(i = parseInt( c )) ? 0 : i;
    }
    $.innerSheetWidth = $.sheetWidth - p.left - p.right;
    $.innerSheetHeight = $.sheetHeight - p.top - p.bottom;
    
    if ( (c = conf.cellMargin) instanceof Object ) {
      m.top = isNaN(i = parseInt(c.top)) ? 0 : i;
      m.right = isNaN(i = parseInt( c.right ))
          ? c.top : i;
      m.bottom = isNaN(i = parseInt( c.bottom ))
          ? c.top : i;
      m.left = isNaN(i = parseInt( c.left ))
          ? c.left : i;
    } else {
      m.top = m.right = m.bottom = m.left
          = isNaN(i = parseInt( c )) ? 0 : i;
    }
    
    if ( isNaN(c = parseInt( conf.columns )) ) {
      $.columns = $.innerSheetWidth
          / ( $.cellWidth + m.left + m.right )
    } else {
      $.columns = c;
      $.cellWidth = ( $.innerSheetWidth
          / c - m.left - m.right ) | 0
    }
  
    if ( isNaN(c = parseInt( conf.rows )) ) {
      $.rows = $.innerSheetHeight
          / ( $cellHeight + m.top + m.bottom )
    } else {
      $.rows = c;
      $.cellHeight = ( $.innerSheetHeight
          / c - m.top - m.bottom ) | 0
    }
    
    $.cellCount = $.columns * $.rows;
    $.outerCellWidth = $.cellWidth + m.left + m.right;
    $.outerCellHeight = $.cellHeight + m.top + m.bottom;
    if ( (c = conf.className) ) {
      $.className = ( typeof c === 'string' ) 
          ? c : 'sheetgrid' + SheetGrid.instanceNumber;
    }
    
    return $
  }
  
  getCellSize ( columnIndex, rowIndex ) {
    return {
      width: this.cellWidth * this.scaleX,
      height: this.cellHeight * this.scaleY
    }
  }
  
  getCellPosition ( columnIndex, rowIndex ) {
    var $ = this
        , p = $.sheetPadding
        , m = $.cellMargin
        ;
    return {
            x: ( p.left + m.left + this.outerCellWidth
                * columnIndex ) * this.scaleX,
            y: ( p.top + m.top + this.outerCellHeight
                * rowIndex ) * this.scaleY
          }
  }
  
  getCellRect ( columnIndex, rowIndex ) {
    var s = this.getCellSize( columnIndex, rowIndex ),
        r = this.getCellPosition( columnIndex, rowIndex )
        ;
    r.x1 = r.x + s.width,
    r.y1 = r.y + s.height
    return r
  }
  
  // create style for a cell[index] element
  calcCellStyle ( columnIndex, rowIndex ) {
    var cs = this.getCellSize( columnIndex, rowIndex )
        , s = this.className ? {} : {
              overflow: 'hidden',
              padding: '0px'
            }
        ;
    Object.assign( s, {
      width: cs.width + 'px',
      height: cs.height + 'px'
    } );
    
    return s
  }
  
  // get the style for a cell[index] inner element
  calcCellInnerStyle ( columnIndex, rowIndex ) {
    var s = this.className ? {} : {
              position: 'relative',
              margin: '0px',
              padding: '0px',
              border: '0px none',
              outline: '0px none',
              width: this.sheetWidth * this.scaleX + 'px',
              height: this.sheetHeight * this.scaleY + 'px'
            }
        , cp = this.getCellPosition( columnIndex, rowIndex )
        ;
    Object.assign( s, {
      left: -cp.x + 'px',
      top: -cp.y + 'px'
    } );
    
    return s
  }
  
  calcCellBackgroundStyleByIndex ( index ) {
    return this.verticalIndexing
        ? this.calcCellBackgroundStyle( index % this.rows
            , ( index / this.rows ) | 0 )
        : this.calcCellBackgroundStyle( index % this.columns
            , ( index / this.columns ) | 0 );
  }
  calcCellBackgroundStyle ( columnIndex, rowIndex ) {
    var s = this.calcCellStyle( columnIndex, rowIndex )
        , p = this.getCellPosition( columnIndex, rowIndex )
        ;
    this.className || Object.assign( s
        , {
            'background-repeat': 'no-repeat',
            'background-size':
                this.sheetWidth * this.scaleX + 'px '
                + this.sheetHeight * this.scaleY + 'px'
          } );

    Object.assign( s, {
      'background-position': + -p.x + 'px '
          + -p.y + 'px'
    } );
    
    return s
  }
  
  setElementStyle ( htmlElement, columnIndex, rowIndex, url ) {
    var $ = this
        , imageElement
        ;
    
    imageElement = htmlElement.firstElementChild
        || htmlElement.appendChild(
            document.createElement( 'IMG' ) );
    
    if ( $.className ) {
      htmlElement.classList.add( $.className )
    } else {
      Object.assign( htmlElement.style
          , this.calcCellStyle( columnIndex, rowIndex ) );
    }
    Object.assign( imageElement.style
        , this.calcCellInnerStyle( columnIndex, rowIndex ) );
    if ( url && 'src' in imageElement ) {
      imageElement.setAttribute( 'src', url )
    }
    
    return $
  }
  
  setElementBackgroundStyle ( htmlElement
      , columnIndex, rowIndex, url ) {
    var $ = this
        ;
    if ( $.className ) {
      htmlElement.classList.add( $.className )
    }
    Object.assign( htmlElement.style
        , this.calcCellBackgroundStyle( columnIndex, rowIndex ) );
    if ( url ) {
      htmlElement.style['background-image']
          = 'url(' + url + ')'
    }
    
    return $
  }
  
  writeStylesheet ( styleElement, url, className ) {
    const writeRule = ( styleElement, ruleName, style ) => {
      var rule = [ruleName + ' {']
          name
          ;
      for ( name in style ) {
        rule.push( name + ': ' + style[name] + ';' )
      }
      rule.push( '}\n' );
      
      styleElement.appendChild( document.createTextNode( rule.join( '\n' ) ) )
    };
    
    var $ = this
        , s
        ;
    styleElement || (styleElement
        = document.head.appendChild( document.createElement( 'STYLE' ) ));
    className || (className = $.className);
    if ( ! className ) {
      throw new Error( 'className required' )
    }
    
    $.className = undefined;
    
    // container style rule
    writeRule( styleElement, '.' + className
        , this.calcCellStyle( 0, 0 ) );
            
    // container without inner style rule
    s = Object.assign( {
          'background-image': 'url(' + url + ')'
        }, this.calcCellBackgroundStyle( 0, 0 ) );
    writeRule( styleElement
        , '.' + className + ':empty'
            + ',.' + className + '.sheetgrid-background'
        , s );
    
    // container inner style rule
    writeRule( styleElement
        , '.' + className + '>*:first-child'
        , this.calcCellInnerStyle( 0, 0 )
        );
    
    $.className = className;
    
    return styleElement
    
  }
  
}

SheetGrid.instanceNumber = 0;

(()=>{
var proto = SheetGrid.prototype;
Object.getOwnPropertyNames( proto ).forEach( name => {
  var newName, func, args, newargs, callargs, i
      ;
  
  if ( (func = proto[name]) instanceof Function
      && (args = /(?:function\s+)?(?:[\w$]+\s*)?\(([^\)]*)\)/
      .exec( func.toString() )) ) {
    args = args[1].trim().split( /\s*,\s*/ );
    console.log( 'checking ' + name + ' ('
        + args.join( ', ' ) + ' )' );
    if ( (i = args.indexOf( 'columnIndex' )) >= 0
        && args[i+1] === 'rowIndex' ) {
      (newargs = args.slice())
          .splice( i, 2, 'index' );
      (callargs = args.slice())
          .splice( i, 2, 'index % c', '( index / c ) | 0' );
      Object.defineProperty( proto
          , newName = name + 'ByIndex'
          , { value: new Function ( newargs
          , 'var c=this.verticalIndexing?this.rows:this.columns;'
          + 'return this.' + name
          + '(' + callargs.join() + ')' ) } );
      console.log( 'created ' + newName );
    }
  }
} ) })();


