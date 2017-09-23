game.fx = {
  build: function() {
    var loaded = [];
    $.each(game.player.picks, function (i, hero) {
      $.each(game.data.skills[hero], function (skillname, skill) {
        if (skill.fx) $.each(skill.fx, function (j, fxname) {
          game.fx.load(hero, fxname, skillname);
        });
      });
      loaded.push(hero);
    });
    $.each(game.enemy.picks, function (i, hero) {
      if (loaded.indexOf(hero) < 0) {
        $.each(game.data.skills[hero], function (skillname, skill) {
          if (skill.fx) $.each(skill.fx, function (j, fxname) {
            game.fx.load(hero, fxname, skillname);
          });
        });
      }
    });
  },
  load: function (hero, name, skill) {
    var img = $('<img>').appendTo(game.hidden);
    img.on('load', game.fx.loaded.bind(this, hero, name, skill));
    img.attr({src: '/img/fx/'+hero+'/'+name+'.png'});
  },
  imgs: [],
  loaded: function (hero, name, skill) {
    var fx = $('<div>').addClass(skill + ' fx fx-'+hero);
    if (skill != name) fx.addClass(name);
    fx.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
      game.fx.hide(fx);
    });
    if (!game.fx.imgs[hero]) game.fx.imgs[hero] = [];
    if (!game.fx.imgs[hero][skill]) game.fx.imgs[hero][skill] = {};
    game.fx.imgs[hero][skill][name] = fx;
  },
  add: function (name, source, target, tag) {
    var hero = source.data('hero');
    var fx = game.fx.imgs[hero][name][name];
    if (!fx) fx = game.fx.imgs[hero][name][name+'-close'];
    if (fx) {
      if (tag == 'linear') {
        var dir = source.getDirectionStr(target);
        fx.addClass(dir);
      }
      if (tag == 'rotate') {
        var dirX = source.getX() - target.getX();
        var dirY = source.getY() - target.getY();
        if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) fx = game.fx.imgs[hero][name][name+'-far'];
        fx.addClass('r'+dirX+dirY);
      }
      fx.appendTo(target);
      game.fx.play(fx);
    }
  },
  play: function (fx) {
    fx[0].style.animationPlayState = 'running';
  },
  pause: function (fx) {
    fx[0].style.animationPlayState = 'paused';
  },
  hide: function (fx) {
    game.fx.pause(fx);
    fx.removeClass('top bottom right left r-1-1 r-10 r-11 r0-1 r00 r01 r1-1 r10 r11').appendTo(game.hidden);
  }
};