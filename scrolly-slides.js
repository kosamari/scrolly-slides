function Scrolly () {
  var articleWidth = 340
  var sectionPositions = []
  var currentSection = 0
  var $el = {
    window: $(window),
    article: $('.scrolly-article'),
    slides: $('.scrolly-slide'),
    sections: $('.scrolly-section')
  }

/*
 * UTILITIES
 */

  function findClosest (array, target) {
    return array.map(function (val, i) {
      return [val, i, Math.abs(val - target)]
    }).reduce(function (memo, val) {
      return (memo[2] < val[2]) ? memo : val
    })
  }

  // Scrolly Slide adds page number hash
  function readURL () {
    var id = window.location.hash.split('#')[1]
    return id ? parseInt(id, 10) : 0
  }

  function writeURL (loc) {
    window.location.hash = loc
  }

/*
 * EVENT HANDLERS
 */

  function handleWindowResize () {
    // resize width of slide elements
    var margin = parseInt($el.slides.css('margin-left'), 10)
    var paddingL = parseInt($el.slides.css('padding-left'), 10)
    var paddingR = parseInt($el.slides.css('padding-right'), 10)

    if (margin) { // article view is visible
      $el.slides.css({width: window.innerWidth - margin - paddingL - paddingR})
    } else {
      $el.slides.css({width: window.innerWidth - paddingL - paddingR})
    }

    // add bottom margin to the last section
    var $lastel = $('.scrolly-section-last')
    var marginBottom = window.innerHeight - ($lastel[0].getBoundingClientRect().bottom - $lastel[0].getBoundingClientRect().top)

    $lastel.css({'margin-bottom': marginBottom + 'px'})
  }

  function handleScroll (newSectionIndex) {
    // get data of current section from data attributes
    var $sctionEl = $($el.sections[newSectionIndex])
    var slideId = $sctionEl.data('slideId')
    var fragmentIds = $sctionEl.data('fragmentIds')
    var eventName = $sctionEl.data('eventName')

    // transform fragmentIds to an Array
    if (fragmentIds) {
      fragmentIds = fragmentIds.toString().split(',').map(function (e) { return parseInt(e, 10) })
    }

    // update current section counter
    currentSection = newSectionIndex

    // change page hash
    writeURL(newSectionIndex)

    // update opacity of sections (current section is set to opacity 1)
    $el.sections.each(function (index, sectionEl) {
      var el = $(sectionEl)
      if (index === currentSection) {
        return el.css({'opacity': 1})
      }
      return el.css({'opacity': 0.2})
    })

    // update each slide element based on data attributes of section element
    $el.slides.each(function (index, slideEl) {
      var el = $(slideEl)

      // Set visiblity of slide element
      if(slideId === el.data('slideId')){
        // trigger Event
        if (eventName) {
          window.dispatchEvent(new Event(eventName))
        }

        // check fragments to render
        if (fragmentIds) {
          el.children().each(function (index, cel) {
            var $cel = $(cel)
            fragmentIds.indexOf($cel.data('fragmentId')) >= 0
              ? $cel.show()
              : $cel.hide()
          })
        }
        return el.show()
      }
      return el.hide()
    })
  }

/*
 * PUBLIC METHODS
 */

  // Toggle article view
  this.toggleArticle = function (show) {
    var width = show ? articleWidth : 0
    var paddingL = parseInt($el.slides.css('padding-left'), 10)
    var paddingR = parseInt($el.slides.css('padding-right'), 10)
    $el.slides.animate({
      'margin-left': width + 'px',
      'width': (window.innerWidth - width - paddingL - paddingR) + 'px'
    })
  }

  // init method
  this.init = function (opt) {
    opt = opt || {}

    // set width of article
    $el.article.css({width: articleWidth + 'px'})

    // show/hide article based on option passed
    var width = opt.show_article ? articleWidth : 0
    $el.slides.css({'margin-left': width + 'px'})

    // create position map of sections
    var startPos
    $el.sections.each(function (i, el) {
      var top = el.getBoundingClientRect().top
      if (i === 0) {
        startPos = top
      }
      sectionPositions.push(top - startPos)
    })

    // hide everything except very 1st .scrolly-slide element
    $el.slides.each(function (index, slideEl) {
      if (index) {
        $(slideEl).hide()
      }
    })

    // bind window resize event
    handleWindowResize()
    $el.window.on('resize', function () {
      handleWindowResize()
    })


    // bind scroll event
    $el.window.scroll(function () {
      var position = window.pageYOffset - 10
      var newSectionIndex = findClosest(sectionPositions, position)[1]
      if (currentSection !== newSectionIndex) {
        handleScroll(newSectionIndex)
      }
    })

    // bind key event
    $el.window.keydown(function (e) {
      var prev = currentSection - 1
      var next = currentSection + 1
      switch (e.keyCode) {
        case 39: // right arrow
          e.preventDefault()
          if (next < sectionPositions.length) {
            window.scrollTo(0, sectionPositions[next])
          }
          break
        case 40: // down arrow
          e.preventDefault()
          if (next < sectionPositions.length) {
            window.scrollTo(0, sectionPositions[next])
          }
          break
        case 34: // page down
          e.preventDefault()
          if (next < sectionPositions.length) {
            window.scrollTo(0, sectionPositions[next])
          }
          break
        case 32: // space
          e.preventDefault()
          if (next < sectionPositions.length) {
            window.scrollTo(0, sectionPositions[next])
          }
          break
        case 37: // left arrow
          e.preventDefault()
          if (prev >= 0) {
            window.scrollTo(0, sectionPositions[prev])
          }
          break
        case 38: // up arrow
          e.preventDefault()
          if (prev >= 0) {
            window.scrollTo(0, sectionPositions[prev])
          }
          break
        case 33: // page up
          e.preventDefault()
          if (prev >= 0) {
            window.scrollTo(0, sectionPositions[prev])
          }
          break
        default: return
      }
    })

    // Lastly, look up page hash & scroll to appropriate location
    var url = readURL()
    if (!url) { handleScroll(0) }
    window.scrollTo(0, sectionPositions[readURL()])
  }
}
