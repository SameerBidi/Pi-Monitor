var defaultColor = [220, 220, 220];
var greenColor = [0, 191, 54];
var orangeColor = [230, 99, 0];
var redColor = [255, 25, 0];

var cpuFreqCircles = [];

window.onload = function onLoad() 
{
  initCircles();
  getHwdInfo();
};

function initCircles()
{
  $('.progress').each
  (
    function()
    {
      let circle = new ProgressBar.Circle
      (
        '#' + $(this).prop('id'), 
        {
          duration: 800,
          easing: 'easeOut',
          strokeWidth: 10
        }
      );
      circle.animate(0);
      cpuFreqCircles.push(circle);
    }
  );
}

function getHwdInfo()
{
  $.ajax
  (
    {
      type: 'GET',
      contentType: 'application/json',
      url: 'http://127.0.0.1:9999/getHwdInfo',
      dataType: 'json',
      cache: false,
      timeout: 600000,
      success: function (response) 
      {
        $('#model').text(response['MODEL']);
        $('#date').text(response['DATE']);
        updateCircles(response);
        setTimeout(function() { getHwdInfo(); }, 1000)
      },
      error: function (e) 
      {
        console.log(e);
      }
    }
  );
}

function updateCircles(data)
{
  cpuFreqCircles.forEach
  (
    function(circle)
    {
      let value = 0;
      let max = 0;
      let postfix = '';

      id = circle._container.id;
      if(id.includes('cpu'))
      {
        max = 100;
        value = data['CPU TEMP'];
        postfix = ' \'C';
      }
      else if(id.includes('gpu'))
      {
        max = 100;
        value = data['GPU TEMP'];
        postfix = ' \'C';
      }
      else if(id.includes('freq'))
      {
        max = 1500;
        postfix = ' mhz';
        switch(id)
        {
          case 'freq0':
            value = data['CPUS'][0]['FREQ'];
          break;

          case 'freq1':
            value = data['CPUS'][1]['FREQ'];
          break;

          case 'freq2':
            value = data['CPUS'][2]['FREQ'];
          break;

          case 'freq3':
            value = data['CPUS'][3]['FREQ'];
          break;
        }
      }
      else if(id.includes('usage'))
      {
        max = 100;
        postfix = '%';
        switch(id)
        {
          case 'usage0':
            value = data['CPUS'][0]['USAGE'];
          break;

          case 'usage1':
            value = data['CPUS'][1]['USAGE'];
          break;

          case 'usage2':
            value = data['CPUS'][2]['USAGE'];
          break;

          case 'usage3':
            value = data['CPUS'][3]['USAGE'];
          break;
        }
      }
      else if(id.includes('mem'))
      {
        max = 100;
        postfix = '%';
        value = data["MEMORY"]
      }
      else if(id.includes('disk'))
      {
        max = 100;
        postfix = '%';
        value = data["DISK"]
      }

      normalized = normalize(value, 0, max);

      circle.animate
      (
        normalized, 
        {
          from: { color: getColorString(circle.value()) },
          to: { color: getColorString(normalized) },
          step: function(state, bar) 
          {
            bar.path.setAttribute('stroke', state.color);
          }
        }
      );

      $('#' + id + ' > h6').text(value + postfix);
    }
  )
}

function normalize(val, min, max) 
{ 
  return (val - min) / (max - min); 
}

function getColorString(value)
{
  if(value == 0)
    return rgbArrayToString(defaultColor);
  else if(value < 0.61)
    return rgbArrayToString(greenColor);
  else if(value > 0.6 && value < 0.8)
    return rgbArrayToString(orangeColor);
  else
    return rgbArrayToString(redColor);
}

function rgbArrayToString(rgb) 
{
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}