// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: image;
// This widget was created by Max Zeryck @mzeryck,在原来的基础上增加了更多内容显示（均来自网络收集）
// Widgets are unique based on the name of the script.
/* 更新内容===============================
 * 1、解决了电量在充满电后继续充电不提示的问题
 * 2、照顾以下小屏幕手机，内容字体变小，以显示全
 * 3、代码修饰了以下，以方便普通用户查找与编辑
 * 4、简化了配置参数修改，让普通用户更方便自定义
 * 5、增加农历显示
 * 6、增加了几个节日提醒
 * 7、周末日期字体红色显示红色
 * 8、适配中文天气简报（天气描述、体感温度、最高温度、风速）
*/

/*========================================
 ***************以下是设置部分***************
 ========================================*/ 

/*
 * WEATHER set
 * 天气信息配置
 * ================
 * 
*/
// Load Your api in "".Get a free API key here: https://openweathermap.org/appid
// 在 "" 内填写你的API—_KEY。在此处获取免费的API密钥：https://openweathermap.org/appid
const API_WEATHER = ""

// add your city ID
// 在 "" 内填入你的City ID。
// const CITY_WEATHER = "1809858";//使用获取定位时不需填此项

// Set to imperial for Fahrenheit, or metric for Celsius
// 华氏度设置为英制imperial，摄氏度设置为公制metric
const TEMPERATURE = "metric";

// Use "\u2103" to show degrees celcius and "\u2109" to show degrees farenheit.
// 使用 "\u2103" 为摄氏度,使用 "\u2109" 为华氏度。
const UNITS = "\u2103";

// Set the locale code. Leave blank "" to match the device's locale. You can change the hard-coded text strings in the TEXT section below.
// 设置语言环境代码。“”内保留空白以匹配设备的语言环境。您可以在下面的“文本”部分中更改硬编码的文本字符串。
let locale = "zh_cn"

// Set to true for fixed location, false to update location as you move around
// 固定使用当前位置设置为true，更换了位置时设置为false以更新位置信息
const lockLocation = true

// Make sure we have a locale value.
// 语言环境值，对应上面设置的语言，不设置将使用设备的语言
if (locale == "" || locale == null) { locale = Device.locale() }

// Declare the data variables.
// 声明数据变量
var locationData, sunData, weatherData

// Create global constants.
// 创建全局常量
const currentDate = new Date()
const cachefiles = FileManager.local()

// Set the padding around each item. Default is 5.
// 设置默认的边距（更多边距设置参考xxxStack.setpadding）
const padding  = 5 

/*
 * Greetings Font/Color set
 * 问候语字体、颜色设置
 * ========================
 * 
*/
const HelloFont    = Font.boldSystemFont(35) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const HelloColor   = new Color("ffffff") //字体颜色
const HelloOpacity = (1) //字体不透明度

// You can change the language or wording of any other text in the widget.
// 您可以更改小部件中任何其他文本的语言。
const  localizedText = {
	// 每个时段问候语
	sleepGreeting: "赶紧睡觉!!!"
	,morningGreeting: "早上好.靓仔"
	,noonGreeting: "中午好.靓仔"
	,afternoonGreeting: "下午好.靓仔"
	,eveningGreeting: "晚上好.靓仔"
	,nightGreeting:"睡觉时间.靓仔"

	// Battery status text set
	// 电量状态提示语设置
	,BatteryText0:  " ⚡" //当接入充电电源提示符
	,BatteryText1:  " ⚡ 已充满电!请拔下电源!" //当充满电还在充电中
	,BatteryText2:  " 电量充足,很有安全感!!!" //当电量在80-100%
	,BatteryText3:  " 电量充足,不出远门没有问题!" //当电量在70-80%
	,BatteryText4:  " 电量还有大半呢,不用着急充电!" //当电量在50-70%
	,BatteryText5:  " 电量用了一半,有时间就充电啦!" //当电量在40-50%
	,BatteryText6:  " 电量用了大半了,尽快充电啦!" //当电量在30-40%
	,BatteryText7:  " 电量就快用完,赶紧充电!" //当电量在20-30%
	,BatteryText8:  " 电量就剩不到20%了,尽快充电!" //当电量在10-20%
	,BatteryText9:  " 电量将耗尽,再不充电我就关机了!" //当电量少于10%
	,BatteryText10: " 正在充入电能中..." //当电量在 < 50%
	,BatteryText12: "电能" //电量前的文字

	//年进度
	,YearText0: "今年" //年进度前的文字
	,YearText1: " 𝒚𝒐𝒖 𝒅𝒊𝒅 𝒚𝒐𝒖𝒓 𝒃𝒆𝒔𝒕 𝒕𝒐𝒅𝒂𝒚 ?!" //年进度标语

}

/*
 * Font/Color set
 * 字体、颜色配置
 * =======================
*/

// Battery status color set
// 电量状态颜色设置
const FullyChargedColor = new Color("ff5f40") //满电提示颜色（判断条件：电量在充电中，并充满电的状态）
const ChargingColor     = new Color("5e5ce6") //正在充电中  （判断条件：在充电中且未充满电）
const AdequateColor     = new Color("c4fb6d") //电量充足颜色（判断条件：电量在80-100%）
const NormalColor       = new Color("d3de32") //电量正常颜色（判断条件：电量在50-79%）
const Low1Corl          = new Color("e5df88") //电量低颜色  （判断条件：电量在30-49%）
const Low2Corl          = new Color("ffd571") //电量偏低颜色（判断条件：电量在20-39%）
const ScarcityColor     = new Color("ec0101") //电量极低颜色（判断条件：电量在0-19%）


// 电量提示语字体大小设置
const BatteryTextFont = Font.regularSystemFont(12); //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const BatteryTextOpacity = (1); //字体不透明度0-1,0.5=半透明

// YearProgress Font/Color set
// 年进度部分字体、颜色配置

const YearProgressText1Font    = Font.regularSystemFont(12); //进度条字体,如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const YearProgressTextOpacity  = (1); //字体不透明度0-1,0.5=半透明
const YearProgressColor        = new Color("6886c5") //颜色
const YearProgressText2Font    = Font.regularSystemFont(14); //标语字体,如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小


// 公历日期字体、颜色设置
const DateTextFont            = Font.regularSystemFont(18) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const DateTextColor           = new Color("ffffff") //字体颜色
const sundayTextColor         = new Color("ff5f40") //字体颜色
const DateTextOpacity         = (0.9) //字体不透明度

// 农历日期字体、颜色设置
const LunarDateTextFont       = new Font("Menlo", 18) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const LunarDateTextColor      = new Color("ffffff") //字体颜色
const LunarDateTextOpacity    = (0.9) //字体不透明度


// 最高/体感度字体、颜色设置
const FeelTextFont = Font.regularSystemFont(12) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const FellTextColor = new Color("e6e6e6") //字体颜色
const FellTextOpacity = (0.7) //字体不透明度

// 当前天气字体、颜色设置
const TempTextFont = Font.regularSystemFont(25) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
const TempTextColor = new Color("ffffff") //字体颜色
const TempTextOpacity = (1) //字体不透明度
const iconsSize = new Size(30, 30) //天气图标尺寸大小

/*========================================
 ***************以下是参数部分***************
 ========================================*/ 

const filename = Script.name() + ".jpg"
const path = cachefiles.joinPath(cachefiles.documentsDirectory(), filename)
let widgetHello = new ListWidget(); 

var widgetInputRAW = args.widgetParameter;

try {
	widgetInputRAW.toString();
} catch(e) {
	widgetInputRAW = "50|#ffffff";
}

var widgetInput = widgetInputRAW.toString();

var inputArr = widgetInput.split("|");


// iCloud file path
// iCloud 文件路径
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
var removeSpaces2 = removeSpaces1.join('');
var tempPath = removeSpaces2.split(".");
var backgroundImageURLRAW = scriptableFilePath + tempPath[0];

var fm = FileManager.iCloud();
var backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
var backgroundImageURLInput = scriptableFilePath + removeSpaces2;

/* 
For users having trouble with extensions,
Uses user-input file path is the file is found,
Checks for common file format extensions if the file is not found.
对于扩展有问题的用户,
使用用户输入的文件路径找到文件,
如果找不到文件，则检查常见的文件格式扩展名。
*/

if (fm.fileExists(backgroundImageURLInput) == false) {
		var fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];
		fileTypes.forEach(function(item) {
			if (fm.fileExists((backgroundImageURL + item.toLowerCase())) == true) {
				backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
			} else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) == true) {
				backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
			}
		});
} else {
	backgroundImageURL = scriptableFilePath + removeSpaces2;
}
var spacing = parseInt(inputArr[1]);

// Get storage.
// 储存空间。
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";
var fm = FileManager.iCloud();

// Fetch Image from Url.
// 从网址获取图片。
async function fetchimageurl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}

// Load image from local drive.
// 从本地加载图像。
async function fetchimagelocal(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
	console.log("file exists: " + finalPath);
	return finalPath;
  }else{
	//throw new Error("Error file not found: " + path);
	if(fm.fileExists(base_path)==false){
	  console.log("Directry not exist creating one.");
	  fm.createDirectory(base_path);
	}
	console.log("Downloading file: " + finalPath);
	await downloadimg(path);
	if(fm.fileExists(finalPath)==true){
	  console.log("file exists after download: " + finalPath);
	  return finalPath;
	}else{
	  throw new Error("Error file not found: " + path);
	}
  }
}

// Weather icons
// 天气icons
async function downloadimg(path){
	const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
	const data = await fetchWeatherData(url);
	var dataimg = null;
	var name = null;
	if(path.includes("bg")){
	  dataimg = data.background;
	  name = path.replace("_bg","");
	}else{
	  dataimg = data.icon;
	  name = path.replace("_ico","");
	}
	var imgurl=null;
	switch (name){
	  case "01d":
		imgurl = dataimg._01d;
	  break;
	  case "01n":
		imgurl = dataimg._01n;
	  break;
	  case "02d":
		imgurl = dataimg._02d;
	  break;
	  case "02n":
		imgurl = dataimg._02n;
	  break;
	  case "03d":
		imgurl = dataimg._03d;
	  break;
	  case "03n":
		imgurl = dataimg._03n;
	  break;
	  case "04d":
		imgurl = dataimg._04d;
	  break;
	  case "04n":
		imgurl = dataimg._04n;
	  break;
	  case "09d":
		imgurl = dataimg._09d;
	  break;
	  case "09n":
		imgurl = dataimg._09n;
	  break;
	  case "10d":
		imgurl = dataimg._10d;
	  break;
	  case "10n":
		imgurl = dataimg._10n;
	  break;
	  case "11d":
		imgurl = dataimg._11d;
	  break;
	  case "11n":
		imgurl = dataimg._11n;
	  break;
	  case "13d":
		imgurl = dataimg._13d;
	  break;
	  case "13n":
		imgurl = dataimg._13n;
	  break;
	  case "50d":
		imgurl = dataimg._50d;
	  break;
	  case "50n":
		imgurl = dataimg._50n;
	  break;
	}
	const image = await fetchimageurl(imgurl);
	console.log("Downloaded Image");
	fm.writeImage(base_path+path+".png",image);
}

// get Json weather.
// 获取天气Json。
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}
// Set up the locationData object.
// 设置位置数据对象
locationData = {}
const locationPath = cachefiles.joinPath(cachefiles.documentsDirectory(), "hello-weather-loc")
  
// If our location is unlocked or cache doesn't exist, ask iOS for location.
// 如果位置已解锁定或不存在缓存，询问iOS
var readLocationFromFile = false
if (!lockLocation || !cachefiles.fileExists(locationPath)) {
    try {
    const location = await Location.current()
    const geocode = await Location.reverseGeocode(location.latitude, location.longitude, locale)
    locationData.latitude = location.latitude
    locationData.longitude = location.longitude
    locationData.locality = geocode[0].locality
    cachefiles.writeString(locationPath, location.latitude + "|" + location.longitude + "|" + locationData.locality)
      
    } catch(e) {
    // If we fail in unlocked mode, read it from the cache.
    if (!lockLocation) { readLocationFromFile = true }
        
    // We can't recover if we fail on first run in locked mode.
    else { return }
    }
 }
// If our location is locked or we need to read from file, do it.
// 如果位置信息被锁定或需要从文件中读取，执行此操作
if (lockLocation || readLocationFromFile) {
    const locationStr = cachefiles.readString(locationPath).split("|")
    locationData.latitude = locationStr[0]
    locationData.longitude = locationStr[1]
    locationData.locality = locationStr[2]
}

// Requirements: location
if (!locationData) { await setupLocation() }

// Set up the cache.
// 设定缓存
    const cachePath = cachefiles.joinPath(cachefiles.documentsDirectory(), "hello-weather-cache")
    const cacheExists = cachefiles.fileExists(cachePath)
    const cacheDate = cacheExists ? cachefiles.modificationDate(cachePath) : 0
    var weatherDataRaw

// If cache exists and it's been less than 60 seconds since last request, use cached data.
// 如果存在缓存，并且距离上次请求少于60秒，使用缓存的数据
if (cacheExists && (currentDate.getTime() - cacheDate.getTime()) < 60000) {
    const cache = cachefiles.readString(cachePath)
    weatherDataRaw = JSON.parse(cache)

// Otherwise, use the API to get new weather data.
// 否则，使用API​​获取新的天气数据
} else {
    const weatherReq = "http://api.openweathermap.org/data/2.5/weather?lat=" + locationData.latitude + "&lon=" + locationData.longitude + "&appid=" + API_WEATHER + "&units=" + TEMPERATURE + "&lang=zh_cn";
    weatherDataRaw = await new Request(weatherReq).loadJSON()
    cachefiles.writeString(cachePath, JSON.stringify(weatherDataRaw))
}
// Completed loading weather data
// 存储天气数据
const cityName = weatherDataRaw.name;
const weatherarry = weatherDataRaw.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherDataRaw.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;
const description = weatherarry[0].description;
const speedwind = weatherDataRaw.wind;
const speed = speedwind.speed;

console.log(weatherDataRaw)


/*
 * DATE/日期
 * ========
*/

/********************************************************************/
/****************************公里转农历****************************/
/********************************************************************/

// 农历1949-2100年查询表
let lunarYearArr = [
	0x0b557, //1949
	0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
	0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
	0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
	0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
	0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
	0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
	0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
	0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
	0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
	0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
	0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
	0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
	0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
	0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
	0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
	0x0d520 //2100
  ],
  lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
  lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
  tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 公历转农历函数
  function sloarToLunar(sy, sm, sd) {
  // 输入的月份减1处理
  sm -= 1;
  
  // 计算与公历基准的相差天数
  // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
  let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
  let ly, lm, ld;
  // 确定输出的农历年份
  for (let j = 0; j < lunarYearArr.length; j++) {
	daySpan -= lunarYearDays(lunarYearArr[j]);
	if (daySpan <= 0) {
	  ly = 1949 + j;
	  // 获取农历年份确定后的剩余天数
	  daySpan += lunarYearDays(lunarYearArr[j]);
	  break
	}
  }
  
  // 确定输出的农历月份
  for (let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
	daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
	if (daySpan <= 0) {
	  // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
	  if (hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
		if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
		  lm = k;
		} else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
		  lm = '闰' + k;
		} else {
		  lm = k + 1;
		}
	  } else {
		lm = k + 1;
	  }
	  // 获取农历月份确定后的剩余天数
	  daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
	  break
	}
  }
  
  // 确定输出农历哪一天
  ld = daySpan;
  
  // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
  if (hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
	lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
  } else {
	lm = lunarMonth[lm - 1];
  }
  
  // 将计算出来的农历年份转换为天干地支年
  ly = getTianGan(ly) + getDiZhi(ly);
  
  // 将计算出来的农历天数转换成汉字
  if (ld < 11) {
	ld = `${lunarDay[10]}${lunarDay[ld-1]}`
  } else if (ld > 10 && ld < 20) {
	ld = `${lunarDay[9]}${lunarDay[ld-11]}`
  } else if (ld === 20) {
	ld = `${lunarDay[1]}${lunarDay[9]}`
  } else if (ld > 20 && ld < 30) {
	ld = `${lunarDay[11]}${lunarDay[ld-21]}`
  } else if (ld === 30) {
	ld = `${lunarDay[2]}${lunarDay[9]}`
  }
  
  return {
	lunarYear: `${ly}年`,
	lunarMonth: `${lm}月`,
	lunarDay: `${ld}`,
  }
  }
  
  // 计算农历年是否有闰月，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
  function hasLeapMonth(ly) {
  // 获取16进制的最后1位，需要用到&与运算符
  if (ly & 0xf) {
	return ly & 0xf
  } else {
	return false
  }
  }
  
  // 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
  function leapMonthDays(ly) {
  if (hasLeapMonth(ly)) {
	// 获取16进制的第1位（0x除外）
	return (ly & 0xf0000) ? 30 : 29
  } else {
	return 0
  }
  }
  
  // 计算农历一年的总天数，参数为存储农历年的16进制
  // 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
  function lunarYearDays(ly) {
  let totalDays = 0;
  
  // 获取正常月的天数，并累加
  // 获取16进制的第2-4位，需要用到>>移位运算符
  for (let i = 0x8000; i > 0x8; i >>= 1) {
	let monthDays = (ly & i) ? 30 : 29;
	totalDays += monthDays;
  }
  // 如果有闰月，需要把闰月的天数加上
  if (hasLeapMonth(ly)) {
	totalDays += leapMonthDays(ly);
  }
  
  return totalDays
  }
  
  // 获取农历每个月的天数
  // 参数需传入16进制数值
  function lunarYearMonths(ly) {
  let monthArr = [];
  
  // 获取正常月的天数，并添加到monthArr数组中
  // 获取16进制的第2-4位，需要用到>>移位运算符
  for (let i = 0x8000; i > 0x8; i >>= 1) {
	monthArr.push((ly & i) ? 30 : 29);
  }
  // 如果有闰月，需要把闰月的天数加上
  if (hasLeapMonth(ly)) {
	monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
  }
  
  return monthArr
  }
  
  // 将农历年转换为天干，参数为农历年
  function getTianGan(ly) {
  let tianGanKey = (ly - 3) % 10;
  if (tianGanKey === 0) tianGanKey = 10;
  return tianGan[tianGanKey - 1]
  }
  
  // 将农历年转换为地支，参数为农历年
  function getDiZhi(ly) {
  let diZhiKey = (ly - 3) % 12;
  if (diZhiKey === 0) diZhiKey = 12;
  return diZhi[diZhiKey - 1]
  }
  

// Get formatted Date.
// 获取格式化日期。
function getformatteddate(){	
	var months = ['壹月','贰月','叁月','肆月','伍月','陆月','柒月','捌月','玖月','拾月','拾壹月','拾贰月'];
	return months[currentDate.getMonth()] + " " + currentDate.getDate()
	}
	
	// Long-form days and months
	var days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
 	var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
	
/*
 * GREETINGS
 * =========
*/

// Holiday customization.
// 节日问候语定制。
var holidaysByKey = {
	// month,week,day: datetext
	"11,4,4": "感恩节!!!" , //注意格式是每年的11月第四个星期四(并用逗号分开每个节日日期)
	"5,2,7":  "母亲节!!!" ,
	"6,3,7": "父亲节!!!"
}

var holidaysByDate = {
	// month,date: greeting
	"1,1": "Happy " + (currentDate.getFullYear()).toString() + "!",
	"2.14": "情人节",
	"10.1": "国庆快乐!!!",
	"10,31": "🎃万圣节!!!",
	"11.11": "买买买节!!!",
	"12,25": "🎄圣诞节!!!"
}

var holidayKey = (currentDate.getMonth() + 1).toString() + "," +  (Math.ceil(currentDate.getDate() / 7)).toString() + "," + (currentDate.getDay()).toString();
var holidayKeyDate = (currentDate.getMonth() + 1).toString() + "," + (currentDate.getDate()).toString();

// Date Calculations.
// 日期计算。
var weekday = days[ currentDate.getDay() ];
var month = months[ currentDate.getMonth() ];
var date = currentDate.getDate();
var hour = currentDate.getHours();

// Append ordinal suffix to date.
// 日期后缀,中文的全部改为 "日" 即可。
function ordinalSuffix(input) {
	if (input % 10 == 1 && date != 11) {
		return input.toString() + "日";
	} else if (input % 10 == 2 && date != 12) {
		return input.toString() + "日";
	} else if (input % 10 == 3 && date != 13) {
		return input.toString() + "日";
	} else {
		return input.toString() + "日";
	}
}
// Generate date string.
// 日期生成格式顺序。
var Datefull = month + ordinalSuffix(date) + "｜" + weekday;
var lunarDate = sloarToLunar(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
let Lunar = lunarDate['lunarYear']+lunarDate['lunarMonth']+lunarDate['lunarDay']

// Support for multiple greetings per time period.
// 支持每个时间段的多个问候。
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}
var greeting = new String("Howdy.")
if (hour > 1    && hour < 5  )  {greeting = localizedText.sleepGreeting;} 
if (hour < 11                )  {greeting = localizedText.morningGreeting;}
if (hour >= 11  && hour < 13 )  {greeting = localizedText.noonGreeting;} 
if (hour >  13  && hour < 18 )  {greeting = localizedText.afternoonGreeting;} 
if (hour >  17  && hour < 23 )  {greeting = localizedText.eveningGreeting;} 

// Overwrite greeting if calculated holiday
// 如果是特定假期,则使用假期问候语
if (holidaysByKey[holidayKey]) {
	greeting = holidaysByKey[holidayKey];
}
// Overwrite all greetings if specific holiday
// 如果是节假日,则使用假期问候语
if (holidaysByDate[holidayKeyDate]) {
	greeting = holidaysByDate[holidayKeyDate];
}

/*
 * BATTERY/电池电量
 * ==============
*/

// Battery Render
// 电量信息
function getBatteryLevel() {
	const batteryLevel = Device.batteryLevel()
	const batteryAscii = Math.round(batteryLevel * 100);
	return batteryAscii + "%";
}
function renderBattery() { 
	const batteryLevel = Device.batteryLevel(); 
	const juice = "▓".repeat(Math.floor(batteryLevel * 10)); 
	const used = "░".repeat(10 - juice.length);
	const batteryAscii = " " + juice + used + " " ; 
	return batteryAscii; 
}
/*
 * YEAR PROGRESS/年进度
 * ===================
*/

// Year Render
// 年进度信息
function getYearProgress() {
	const now = new Date()
	const start = new Date(now.getFullYear(), 0, 1) // Start of this year
	const end = new Date(now.getFullYear() + 1, 0, 1) // End of this year
	const yearPassed = (now - start)
	const yearALL = (end - start)
	const yearPercen = (yearPassed) / (yearALL)
	const yearProgress = Math.round(yearPercen * 100);
	return yearProgress + "%";
}
function renderYear() {
	const now = new Date()
	const start = new Date(now.getFullYear(), 0, 1) // Start of this year
	const end = new Date(now.getFullYear() + 1, 0, 1) // End of this year
	const yearPassed = (now - start)
	const yearALL = (end - start)
	const yearPercen = (yearPassed) / (yearALL)
	const yearAscii = yearPercen;  
	const passed = '▓'.repeat(Math.floor(yearAscii * 10));
	const left = '░'.repeat(10 - passed.length);
	const yearProgress = " " + passed + left + " ";
	return yearProgress;
}

if (config.runsInWidget) {
	let widget = new ListWidget()
	widget.backgroundImage = cachefiles.readImage(path)
  
/*========================================
 ***************以下是小组件部分*************
 *****你可以添加其他小组件以显示在Widgets上****
 ========================================*/ 

 
// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（helloStack）
let helloStack = widgetHello.addStack();
	helloStack.layoutHorizontally();
	helloStack.setPadding(padding*3, padding, padding/2, padding)

// Greeting label
// 问候标签
const hello = helloStack.addText(greeting + "  ");
hello.font = HelloFont; 
hello.textColor = HelloColor; 
hello.textOpacity = HelloOpacity; 

// Weather icons in stack
// 天气图标
var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));
const widgetimg = helloStack.addImage(img); 
widgetimg.imageSize = iconsSize; 

// tempeture label in stack
// 温度
let temptext = helloStack.addText(Math.round(curTemp).toString()+UNITS);
	temptext.font = TempTextFont; 
	temptext.textColor = TempTextColor; 
	temptext.textOpacity = TempTextOpacity; 


// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
let fellStack = widgetHello.addStack();
	fellStack.layoutHorizontally();
	fellStack.setPadding(padding/2 , padding, padding/2, padding)

// Widget feel temp
// 天气简报（最高温度与最低温度）
const feeltext =fellStack.addText("今日  " + description + " " + " 体感: " + Math.round(feel_like) + UNITS + ";" + " 最高: " + Math.round(highTemp) + UNITS + " 风速: " + speed + "米/秒");
feeltext.font = FeelTextFont; 
feeltext.textColor = FellTextColor;
feeltext.textOpacity = FellTextOpacity; 


// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack0）
let yearStack = widgetHello.addStack();
	yearStack.layoutHorizontally();
	yearStack.setPadding(padding/2 , padding, padding/2, padding)

// Year icon in stack
// 年进度图标
const YearProgressicon = yearStack.addText(localizedText.YearText0)
YearProgressicon.font = YearProgressText1Font //font and size,字体与大小
YearProgressicon.textColor = YearProgressColor //font color,字体颜色
YearProgressicon.textOpacity = YearProgressTextOpacity; //opacity,不透明度
	//YearProgressicon.leftAlignText(); // 对齐设置,在Stack上无效

// Year label in stack
// 年进度条、标签
const YearProgress = yearStack.addText(renderYear())
YearProgress.font = new Font('Menlo', 12) //font and size,字体与大小
YearProgress.textColor = YearProgressColor //font color,字体颜色
YearProgress.textOpacity = YearProgressTextOpacity; 
	//YearProgress.leftAlignText();// 对齐设置,在Stack上无效

// Year percent in stack
// 年进度百分比
const YearPercentage = yearStack.addText(getYearProgress())
YearPercentage.font = YearProgressText1Font 
YearPercentage.textColor = YearProgressColor
YearPercentage.textOpacity = (1); 
	//YearPercentage.leftAlignText(); // 对齐设置,在Stack上无效

// Year slogan in stack
// 年进度标语
const YearSlogan = yearStack.addText(localizedText.YearText1)
YearSlogan.font = YearProgressText2Font 
YearSlogan.textColor = YearProgressColor
YearSlogan.textOpacity = (YearProgressTextOpacity);


// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack1）
let batteryStack = widgetHello.addStack();
	batteryStack.layoutHorizontally();
	batteryStack.setPadding(padding/2 , padding, padding/2, padding)

// Battery icon in stack
// 电量图标、标签、颜色
const batteryicon = batteryStack.addText(localizedText.BatteryText12);
	batteryicon.font = BatteryTextFont;
if(Device.isCharging() && Device.batteryLevel()  < 1){
  	batteryicon.textColor = ChargingColor; //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	batteryicon.textColor = FullyChargedColor; //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1 &&  !Device.isCharging()){
  	batteryicon.textColor = AdequateColor; //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
  	batteryicon.textColor = NormalColor; //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batteryicon.textColor = Low1Corl; //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batteryicon.textColor = Low2Corl; //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 &&   Device.batteryLevel() < 0.2 && !Device.isCharging()){
	batteryicon.textColor = ScarcityColor; //font color,电量不足字体颜色
}
	batteryicon.textOpacity = BatteryTextOpacity; //opacity,不透明度

// Battery Progress in stack
// 电量进度条、颜色
const batteryLine = batteryStack.addText(renderBattery());
	batteryLine.font = new Font("Menlo", 12); //font and size,字体与大小
if(Device.isCharging() && Device.batteryLevel()  < 1){
  	batteryLine.textColor = ChargingColor; //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
	batteryLine.textColor = FullyChargedColor; //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1  && !Device.isCharging()){
  	batteryLine.textColor = AdequateColor; //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
 	batteryLine.textColor = NormalColor; //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batteryLine.textColor = Low1Corl; //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batteryLine.textColor = Low2Corl; //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 &&   Device.batteryLevel() < 0.2 && !Device.isCharging()){
  	batteryLine.textColor = ScarcityColor; //font color,电量不足字体颜色
}
	batteryLine.textOpacity = BatteryTextOpacity;

// Battery Status in stack
// 电量状态、提示语
var battery =  getBatteryLevel();
if(Device.isCharging() && Device.batteryLevel() < 1 ){
	battery = battery + localizedText.BatteryText0; //充电中并且电量少于100%
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	battery = battery + localizedText.BatteryText1; //充电中（电量充满）
} else if(Device.batteryLevel() > 0.8 && Device.batteryLevel() <= 1  ){
 	battery = battery + localizedText.BatteryText2; //电量在80-100%
} else if(Device.batteryLevel() >= 0.7 && Device.batteryLevel() < 0.8){
 	battery = battery + localizedText.BatteryText3; //电量在70-79%
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.7){
 	battery = battery + localizedText.BatteryText4; //电量在50-69%
} else if(Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
 	battery = battery + localizedText.BatteryText5; //电量在40-49% 且不在充电中
} else if(Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 &&  Device.isCharging()){
	battery = battery + localizedText.BatteryText10; //在充电中
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 && !Device.isCharging()){
 	battery = battery + localizedText.BatteryText6; //电量在30-39% 且不在充电中
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 &&  Device.isCharging()){
 	battery = battery + localizedText.BatteryText10; //在充电中
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
	battery = battery + localizedText.BatteryText7; //电量在20-29% 且不在充电中
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 &&  Device.isCharging()){
	battery = battery + localizedText.BatteryText10; //在充电中
} else if(Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 && !Device.isCharging()){
  	battery = battery + localizedText.BatteryText8; //电量在10-19% 且不在充电中
} else if(Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 &&  Device.isCharging()){
	battery = battery + localizedText.BatteryText10; //在充电中
} else if(Device.batteryLevel() <= 0.1 && !Device.isCharging()){
 	battery = battery + localizedText.BatteryText9; //电量在1-9% 且不在充电中
} else if(Device.batteryLevel() <= 0.1 &&  Device.isCharging()){
	battery = battery + localizedText.BatteryText10;
}
// Battery Status Color
// 电量状态颜色
let batterytext = batteryStack.addText(battery);
	batterytext.font = BatteryTextFont; //font and size,字体与大小
if(Device.isCharging() && Device.batteryLevel() < 1){
	batterytext.textColor = ChargingColor; //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	batterytext.textColor = FullyChargedColor; //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1 && !Device.isCharging()){
  	batterytext.textColor = AdequateColor; //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
  	batterytext.textColor = NormalColor; //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batterytext.textColor = Low1Corl; //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batterytext.textColor = Low2Corl; //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 && Device.batteryLevel() < 0.2 && !Device.isCharging()){
	batterytext.textColor = ScarcityColor; //font color,电量不足字体颜色
}
	batterytext.textOpacity = BatteryTextOpacity; //opacity,不透明度

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
let dateStack = widgetHello.addStack();
	dateStack.layoutHorizontally();
	dateStack.setPadding(padding/2 , padding, padding*3, padding)

// Date label
// 日期
const datetext = dateStack.addText(Datefull + " ");
datetext.font = DateTextFont;
if( weekday = "星期六" ){
	datetext.textColor = sundayTextColor;
} if( weekday = "星期日" ){
	datetext.textColor = sundayTextColor;
} if ( (weekday = "星期一") || (weekday = "星期二") || (weekday = "星期三") || (weekday = "星期四") || (weekday = "星期五") ){
	datetext.textColor = DateTextColor;
}
datetext.textOpacity = DateTextOpacity; 
datetext.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// lunar
// 农历
const lunarDateText = dateStack.addText(Lunar);
	  lunarDateText.font = LunarDateTextFont; //font and size,字体与大小
	  lunarDateText.textColor = LunarDateTextColor; //font color,字体颜色
	  lunarDateText.textOpacity = LunarDateTextOpacity; //opacity,不透明度


 widgetHello.backgroundImage = widget.backgroundImage
 Script.setWidget(widgetHello)

//Script.complete()


/*==============================================
 ************以下是小组件透明背景生成脚本************
 =============================================*/ 
} else {
  
  // Determine if user has taken the screenshot.
  // 确定用户是否有了屏幕截图。
  var message
  message = "以下是【透明背景】生成步骤，如果你没有屏幕截图请退出，并返回主屏幕长按进入编辑模式。滑动到最右边的空白页截图。然后重新运行！"
  let exitOptions = ["继续(已有截图)","退出(没有截图)"]
  let shouldExit = await generateAlert(message,exitOptions)
  if (shouldExit) return
  
  // Get screenshot and determine phone size.
  // 获取屏幕截图并确定手机大小。
  let img = await Photos.fromLibrary()
  let height = img.size.height
  let phone = phoneSizes()[height]
  if (!phone) {
    message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次!"
    await generateAlert(message,["好的！我现在去截图"])
    return
  }
  
  // Prompt for widget size and position.
  // 提示窗口小部件的大小和位置。
  message = "您想要创建什么尺寸的小部件？"
  let sizes = ["Small","Medium","Large"]
  let size = await generateAlert(message,sizes)
  let widgetSize = sizes[size]
  
  message = "您想它在什么位置？"
  message += (height == 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "")
  
  // Determine image crop based on phone size.
  // 根据手机大小确定图像裁剪。
  let crop = { w: "", h: "", x: "", y: "" }
  if (widgetSize == "Small") {
    crop.w = phone.small
    crop.h = phone.small
    let positions = ["Top left","Top right","Middle left","Middle right","Bottom left","Bottom right"]
    let position = await generateAlert(message,positions)
    
    // Convert the two words into two keys for the phone size dictionary.
    let keys = positions[position].toLowerCase().split(' ')
    crop.y = phone[keys[0]]
    crop.x = phone[keys[1]]
    
  } else if (widgetSize == "Medium") {
    crop.w = phone.medium
    crop.h = phone.small
    
    // Medium and large widgets have a fixed x-value.
    crop.x = phone.left
    let positions = ["Top","Middle","Bottom"]
    let position = await generateAlert(message,positions)
    let key = positions[position].toLowerCase()
    crop.y = phone[key]
    
  } else if(widgetSize == "Large") {
    crop.w = phone.medium
    crop.h = phone.large
    crop.x = phone.left
    let positions = ["Top","Bottom"]
    let position = await generateAlert(message,positions)
    
    // Large widgets at the bottom have the "middle" y-value.
    crop.y = position ? phone.middle : phone.top
  }
  
  // Crop image and finalize the widget.
  // 裁剪图像并完成小部件。
  let imgCrop = cropImage(img, new Rect(crop.x,crop.y,crop.w,crop.h))
  
  message = "您的小部件背景已准备就绪。您想在Scriptable的小部件中使用它还是导出图像？"
  const exportPhotoOptions = ["在Scriptable中使用","导出图像"]
  const exportPhoto = await generateAlert(message,exportPhotoOptions)
  
  if (exportPhoto) {
    Photos.save(imgCrop)
  } else {
    cachefiles.writeImage(path,imgCrop)
  }
  
  Script.complete()
}

// Generate an alert with the provided array of options.
// 使用提供的选项数组生成提示
async function generateAlert(message,options) {
  
  let alert = new Alert()
  alert.message = message
  
  for (const option of options) {
    alert.addAction(option)
  }
  
  let response = await alert.presentAlert()
  return response
}

// Crop an image into the specified rect.
// 将图像裁剪为指定的矩形。
function cropImage(img,rect) {
   
  let draw = new DrawContext()
  draw.size = new Size(rect.width, rect.height)
  
  draw.drawImageAtPoint(img,new Point(-rect.x, -rect.y))  
  return draw.getImage()
}

// Pixel sizes and positions for widgets on all supported phones.
// 所有支持的手机上小部件的像素大小和位置。
function phoneSizes() {
  let phones = {
	// iPhone Xs Max \ iPhone 11 Pro Max	
	"2688": {
			"small":  507,
			"medium": 1080,
			"large":  1137,
			"left":  81,
			"right": 654,
			"top":    228,
			"middle": 858,
			"bottom": 1488
	},
	// iPhone Xr \ iPhone 11
	"1792": {
			"small":  338,
			"medium": 720,
			"large":  758,
			"left":  54,
			"right": 436,
			"top":    160,
			"middle": 580,
			"bottom": 1000
	},
	// iPhone X/XS \ iPhone 11 Pro
	"2436": {
			"small":  465, 
			"medium": 987,
			"large":  1035,
			"left":  69,
			"right": 591,
			"top":    213,
			"middle": 783,
			"bottom": 1353
	},
	// iPhone 6P/7P/8P 
	"2208": {
			"small":  471,
			"medium": 1044,
			"large":  1071,
			"left":  99,
			"right": 672,
			"top":    114,
			"middle": 696,
			"bottom": 1278
	},
	// iPhone 6\7\8\SE(4.7)
	"1334": {
			"small":  296,
			"medium": 642,
			"large":  648,
			"left":  54,
			"right": 400,
			"top":    60,
			"middle": 412,
			"bottom": 764
	},
	// iPhone SE \ iPod Touch 5th generation and later
	"1136": {
			"small":  282,
			"medium": 584,
			"large":  622,
			"left": 30,
			"right": 332,
			"top":  59,
			"middle": 399,
			"bottom": 399
	},
	// iPhone Xr 特别版
        "1624": {
                        "small": 310,
                        "medium": 658,
                        "large": 690,
                        "left": 46,
                        "right": 394,
                        "top": 142,
                        "middle": 522,
                        "bottom": 902 
        }
  }
  return phones
}
