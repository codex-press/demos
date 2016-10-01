import {typekit} from 'utility';

typekit({kitId: 'ndg1ffp'});


import article from 'article';
import Plugin from 'plugin';
import dom from 'dom';

let fall = 300;

article.register('.rabbit-hole', class RabbitHole extends Plugin {


  constructor(args) {
    super(args);
    this.bind({
      scroll: 'scroll',
      resize: 'resize',
    });

    setTimeout(() => this.resize());
  }

  resize() {
    let top = this.rect().top;
    console.log({top});
    let z = 0;
    this.levels = this.children().reduce((levels, el) => {
      let rect = dom(el).rect();
      if (dom(el).is('.level'))
        levels.push({z: -z, top: rect.top - top, bottom: rect.bottom - top});

      dom(el).setTransform({z});
      z -= fall;
      return levels;
    },[]);

  }


  scroll(rect) {

    if (!this.levels)
      this.resize();

    let perspective = Math.round(-rect.top + window.innerHeight * .7);
    this.css({perspectiveOrigin: `center ${perspective}px`});

    // So the hard thing here is there are levels of flat and in between 
    // parts where it's just falling straight down. In order to find where
    // to tween, finds the start level and the end level.
    let level1 = this.levels.find(({z, top, bottom}, i) => {
      return (
        // at end of array
        i+1 >= this.levels.length ||
        // the top of the next one is below the midpoint
        rect.top + this.levels[i+1].top > window.innerHeight / 2
      );
    });

    let level2 = this.levels.find(({z, top, bottom}) => {
      // the bottom of this one is below the midpoint
      return rect.top + bottom > window.innerHeight / 2;
    });

    let z;
    // This means it is on a level, use that offset
    if (level1 === level2)
      z = level1.z
    // Inbetween levels, interpolate between them
    else {
      let distance = level2.top - level1.bottom;
      let pos = -1 * (rect.top + level1.bottom - window.innerHeight / 2);
      pos /= distance;
      z = Math.round(level1.z + pos * (level2.z - level1.z));
    }

    this.children().map(el => {
      dom(el).setTransform({z});
      z -= fall;
    });

  }

});

