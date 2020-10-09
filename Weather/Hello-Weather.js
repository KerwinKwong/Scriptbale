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
*/

const filename = Script.name() + ".jpg"
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
let widgetHello = new ListWidget(); 
var today = new Date();

var widgetInputRAW = args.widgetParameter;

try {
	widgetInputRAW.toString();
} catch(e) {
	widgetInputRAW = "50|#ffffff";
}

var widgetInput = widgetInputRAW.toString();

var inputArr = widgetInput.split("|");

// iCloud file path
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

/*
 * Spacer set
 * 间距设置
 * ==========
 * 
*/
let TopSpacer = 15 //顶部间距
let HSpacer = 5 //纵向间距
let LeftSpacer = 5 //向左对齐间距
/*
 * Greetings Font/Color set
 * 问候语字体、颜色设置
 * ========================
 * 
*/
let HelloFont = Font.boldSystemFont(35) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let HelloColor = "ffffff" //字体颜色
let HelloOpacity = (1) //字体不透明度

/*
 * Battery Font/Color set
 * 电量部分字体、颜色配置
 * =======================
*/
// Battery status color set
// 电量状态颜色设置
let FullyChargedColor = 'ff5f40'; //满电提示颜色（判断条件：电量在充电中，并充满电的状态）
let ChargingColor     = '5e5ce6'; //正在充电中  （判断条件：在充电中且未充满电）
let AdequateColor     = 'c4fb6d'; //电量充足颜色（判断条件：电量在80-100%）
let NormalColor       = 'd3de32'; //电量正常颜色（判断条件：电量在50-79%）
let Low1Corl          = 'e5df88'; //电量低颜色  （判断条件：电量在30-49%）
let Low2Corl          = 'ffd571'; //电量偏低颜色（判断条件：电量在20-39%）
let ScarcityColor     = 'ec0101'; //电量极低颜色（判断条件：电量在0-19%）

// Battery status text set
// 电量状态提示语设置
let BatteryText0   = " ⚡" //当接入充电电源提示符
let BatteryText1   = " ⚡ 已充满电!请拔下电源!" //当充满电还在充电中
let BatteryText2   = " 电量充足,很有安全感!!!" //当电量在80-100%
let BatteryText3   = " 电量充足,不出远门没有问题!" //当电量在70-80%
let BatteryText4   = " 电量还有大半呢,不用着急充电!" //当电量在50-70%
let BatteryText5   = " 电量用了一半,有时间就充电啦!" //当电量在40-50%
let BatteryText6   = " 电量用了大半了,尽快充电啦!" //当电量在30-40%
let BatteryText7   = " 电量就快用完,赶紧充电!" //当电量在20-30%
let BatteryText8   = " 电量就剩不到20%了,尽快充电!" //当电量在10-20%
let BatteryText9   = " 电量将耗尽,再不充电我就关机了!" //当电量少于10%
let BatteryText10  = " ⚡ 充电中..." //当电量在>= 50% <100%,并在充电中
let BatteryText11  = " 正在充入电能中..." //当电量在 < 50%
let BatteryText12  = "⚡ 电能"

// 电量提示语字体大小设置
let BatteryTextFont = Font.regularSystemFont(12); //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let BatteryTextOpacity = (1); //字体不透明度0-1,0.5=半透明

/*
 * YearProgress Font/Color set
 * 年进度部分字体、颜色配置
 * ==========================
*/
let YearProgressText1Font    = Font.regularSystemFont(12); //进度条字体,如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let YearProgressTextOpacity = (1); //字体不透明度0-1,0.5=半透明
let YearProgressColor       = '5e5ce6' //颜色
let Yearicons               = "📅 全年" //年进度图标
let YearProgressText2Font   = Font.regularSystemFont(14); //标语字体,如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let YearProgressText        = " 𝒚𝒐𝒖 𝒅𝒊𝒅 𝒚𝒐𝒖𝒓 𝒃𝒆𝒔𝒕 𝒕𝒐𝒅𝒂𝒚 ?!" //年进度标语

/*
 * DATE日期信息配置
 * ================
 * 
*/
let DateTextFont = Font.regularSystemFont(30) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let DateTextColor = "ffffff" //字体颜色
let DateTextOpacity = (0.7) //字体不透明度

/*
 * WEATHER set
 * 天气信息配置
 * ================
 * 
*/
// Load Your api in "".Get a free API key here: https://openweathermap.org/appid
// 在 "" 内填写你的API—_KEY。在此处获取免费的API密钥：https://openweathermap.org/appid
let API_WEATHER = "89065f71db2277c83d22a779a34f16a7"; 

// add your city ID
// 在 "" 内填入你的City ID。
let CITY_WEATHER = "1809858";

// Set to imperial for Fahrenheit, or metric for Celsius
// 华氏度设置为英制imperial，摄氏度设置为公制metric
let TEMPERATURE = "metric";

// Use "\u2103" to show degrees celcius and "\u2109" to show degrees farenheit.
// 使用 "\u2103" 为摄氏度,使用 "\u2109" 为华氏度。
let UNITS = "\u2103";

// 最高/低温度字体、颜色设置
let FeelTextFont = Font.regularSystemFont(12) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let FellTextColor = "51adcf" //字体颜色
let FellTextOpacity = (1) //字体不透明度

// 当前天气字体、颜色设置
let TempTextFont = Font.regularSystemFont(30) //如果使用非系统字体请用这个格式：new Font("Menlo", 12),""内是字体,数字是字体大小
let TempTextColor = "ffffff" //字体颜色
let TempTextOpacity = (1) //字体不透明度
let iconsSize = new Size(40, 40) //天气图标尺寸大小

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

// Get Location 
/*Location.setAccuracyToBest();
let curLocation = await Location.current();
console.log(curLocation.latitude);
console.log(curLocation.longitude);*/

let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=" + TEMPERATURE;
//"http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric"

const weatherJSON = await fetchWeatherData(wetherurl);
const cityName = weatherJSON.name;
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;
//Completed loading weather data

/*
 * DATE
 * ====
*/

// Get formatted Date.
// 获取格式化日期。
function getformatteddate(){
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[today.getMonth()] + " " + today.getDate()
}

// Long-form days and months.
// 日期和月份。
var days = ['周日','周一','周二','周三','周四','周五','周六'];
var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

/*
 * GREETINGS
 * =========
*/

// Greetings arrays per time period. 
// 每个时间段的问候语。
var greetingsMorning = [
'早上好.靓仔'
];
var greetingsNoon = [
'中午好.靓仔'
];
var greetingsAfternoon = [
'下午好.靓仔'
];
var greetingsEvening = [
'晚上好.靓仔'
];
var greetingsNight = [
'睡觉时间.靓仔'
];
var greetingsLateNight = [
'赶紧睡觉!!!'
];

// Holiday customization.
// 节日问候语定制。
var holidaysByKey = {
	// month,week,day: datetext
	"11,4,4": "Happy Thanksgiving!"
}

var holidaysByDate = {
	// month,date: greeting
	"1,1": "Happy " + (today.getFullYear()).toString() + "!",
     "10,31": "Happy Halloween!",
	"12,25": "Merry Christmas!"
}

var holidayKey = (today.getMonth() + 1).toString() + "," +  (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();
var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// Date Calculations.
// 日期计算。
var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();

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
var datefull = month + " " + ordinalSuffix(date) +", " + weekday;

// Support for multiple greetings per time period.
// 支持每个时间段的多个问候。
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}
var greeting = new String("Howdy.")
if (hour < 5 && hour >= 1) { // 1am - 5am
	greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
	greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 11) { // Before noon (5am - 12pm)
	greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >=11 && hour <= 13)  { // 11am - 1pm
	greeting = greetingsNoon[randomGreeting(greetingsNoon)];
} else if (hour > 13 && hour <= 17) { // 1pm - 5pm
	greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
	greeting = greetingsEvening[randomGreeting(greetingsEvening)];
} 

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
 * BATTERY
 * =======
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
 * YEAR PROGRESS
 * =============
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

// Try/catch for color input parameter
// 尝试获取输入的颜色参数
try {
	inputArr[0].toString();
} catch(e) {
	throw new Error("Please long press the widget and add a parameter.");
}
let themeColor = new Color(inputArr[0].toString());
if (config.runsInWidget) {
  let widget = new ListWidget()
  widget.backgroundImage = files.readImage(path)
  
/* You can your own code here to add additional items to the "invisible" background of the widget.
 * 您可以在此处编写自己的代码，以将其他项目添加到小部件。
 * ---------------
 * Assemble Widget 
 * --------------- 
 *Script.setWidget(widget)
 */
 
// Top spacing
// 顶部间距
widgetHello.addSpacer(TopSpacer);

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（helloStack）
let helloStack = widgetHello.addStack();
helloStack.layoutHorizontally();

// Centers line
helloStack.addSpacer(LeftSpacer); //Left spacing,向左对齐间距

// Greeting label
// 问候标签
const hello = helloStack.addText(greeting);
hello.font = HelloFont; //font and size,字体与大小
hello.textColor = new Color(HelloColor); //font color,字体颜色
hello.textOpacity = HelloOpacity; //opacity,不透明度
hello.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小
 
// Spacing between greeting and yearprogress
// 问候标签与年进度行之间的间距
widgetHello.addSpacer(HSpacer);

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack0）
let hStack0 = widgetHello.addStack();
hStack0.layoutHorizontally();

// Centers line
hStack0.addSpacer(LeftSpacer); //Left spacing,向左对齐间距

// Year icon in stack
// 年进度图标
const YearProgressicon = hStack0.addText(Yearicons)
YearProgressicon.font = YearProgressText1Font //font and size,字体与大小
YearProgressicon.textColor = new Color(YearProgressColor) //font color,字体颜色
YearProgressicon.textOpacity = YearProgressTextOpacity; //opacity,不透明度
YearProgressicon.leftAlignText(); //AlignText,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Year label in stack
// 年进度条、标签
const YearProgress = hStack0.addText(renderYear())
YearProgress.font = new Font('Menlo', 12) //font and size,字体与大小
YearProgress.textColor = new Color(YearProgressColor) //font color,字体颜色
YearProgress.textOpacity = YearProgressTextOpacity; 
YearProgress.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Year percent in stack
// 年进度百分比
const YearPercentage = hStack0.addText(getYearProgress())
YearPercentage.font = YearProgressText1Font 
YearPercentage.textColor = new Color(YearProgressColor) 
YearPercentage.textOpacity = (1); 
YearPercentage.leftAlignText(); //AlignText,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Year slogan in stack
// 年进度标语
const YearSlogan = hStack0.addText(YearProgressText)
YearSlogan.font = YearProgressText2Font 
YearSlogan.textColor = new Color(YearProgressColor) 
YearSlogan.textOpacity = (YearProgressTextOpacity);
YearSlogan.leftAlignText(); //AlignText,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小


// Spacing between yearprogress and battery
// 年进度与电量行间距
widgetHello.addSpacer(HSpacer);

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack1）
let hStack1 = widgetHello.addStack();
hStack1.layoutHorizontally();

// Centers line
hStack1.addSpacer(LeftSpacer); //Left spacing,向左对齐间距

// Battery icon in stack
// 电量图标、标签、颜色
const batteryicon = hStack1.addText(BatteryText12);
batteryicon.font = BatteryTextFont;
if(Device.isCharging() && Device.batteryLevel()  < 1){
  	batteryicon.textColor = new Color(ChargingColor); //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	batteryicon.textColor = new Color(FullyChargedColor); //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1 &&  !Device.isCharging()){
  	batteryicon.textColor = new Color(AdequateColor); //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
  	batteryicon.textColor = new Color(NormalColor); //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batteryicon.textColor = new Color(Low1Corl); //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batteryicon.textColor = new Color(Low2Corl); //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 &&   Device.batteryLevel() < 0.2 && !Device.isCharging()){
	batteryicon.textColor = new Color(ScarcityColor); //font color,电量不足字体颜色
}
	batteryicon.textOpacity = BatteryTextOpacity; //opacity,不透明度
	batteryicon.leftAlignText(); //AlignText,对齐方式(center,left,right)

// Battery Progress in stack
// 电量进度条、颜色
const batteryLine = hStack1.addText(renderBattery());
batteryLine.font = new Font("Menlo", 12); //font and size,字体与大小
if(Device.isCharging() && Device.batteryLevel()  < 1){
  	batteryLine.textColor = new Color(ChargingColor); //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
	batteryLine.textColor = new Color(FullyChargedColor); //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1  && !Device.isCharging()){
  	batteryLine.textColor = new Color(AdequateColor); //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
 	batteryLine.textColor = new Color(NormalColor); //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batteryLine.textColor = new Color(Low1Corl); //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batteryLine.textColor = new Color(Low2Corl); //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 &&   Device.batteryLevel() < 0.2 && !Device.isCharging()){
  	batteryLine.textColor = new Color(ScarcityColor); //font color,电量不足字体颜色
}
	batteryLine.textOpacity = BatteryTextOpacity;//opacity,不透明度	
	batteryLine.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Battery Status in stack
// 电量状态、提示语
var battery =  getBatteryLevel();
if(Device.isCharging() && Device.batteryLevel() < 0 &&  Device.batteryLevel() >=0.4){
	battery = battery + BatteryText0;
} if(Device.isCharging() && Device.batteryLevel() < 1 &&  Device.batteryLevel() >=0.5){
  	battery = battery + BatteryText10;
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	battery = battery + BatteryText1;
} else if(Device.batteryLevel() > 0.8 && Device.batteryLevel() <= 1 && !Device.isCharging()){
 	battery = battery + BatteryText2;
} else if(Device.batteryLevel() >= 0.7 && Device.batteryLevel() < 0.8){
 	battery = battery + BatteryText3;
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.7){
 	battery = battery + BatteryText4;
} else if(Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
 	battery = battery + BatteryText5;
} else if(Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 &&  Device.isCharging()){
	battery = battery + BatteryText11;
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 && !Device.isCharging()){
 	battery = battery + BatteryText6;
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 &&  Device.isCharging()){
 	battery = battery + BatteryText11;
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
	battery = battery + BatteryText7;
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 &&  Device.isCharging()){
	battery = battery + BatteryText11;
} else if(Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 && !Device.isCharging()){
  	battery = battery + BatteryText8;
} else if(Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 &&  Device.isCharging()){
	battery = battery + BatteryText11;
} else if(Device.batteryLevel() <= 0.1 && !Device.isCharging()){
 	battery = battery + BatteryText9;
} else if(Device.batteryLevel() <= 0.1 &&  Device.isCharging()){
	battery = battery + BatteryText11;
}
// Battery Status Color
// 电量状态颜色
let batterytext = hStack1.addText(battery);
batterytext.font = BatteryTextFont; //font and size,字体与大小
if(Device.isCharging() && Device.batteryLevel() < 1){
	batterytext.textColor = new Color(ChargingColor); //font color,充电状态字体颜色
} if(Device.isCharging() && Device.batteryLevel() >= 1 || Device.isFullyCharged()){
  	batterytext.textColor = new Color(FullyChargedColor); //font color,满电提示字体颜色
} else if(Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1 && !Device.isCharging()){
  	batterytext.textColor = new Color(AdequateColor); //font color,电量充足字体颜色
} else if(Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()){
  	batterytext.textColor = new Color(NormalColor); //font color,电量正常字体颜色
} else if(Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()){
  	batterytext.textColor = new Color(Low1Corl); //font color,电量偏低字体颜色
} else if(Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()){
  	batterytext.textColor = new Color(Low2Corl); //font color,电量低字体颜色
} else if(Device.batteryLevel() >= 0 && Device.batteryLevel() < 0.2 && !Device.isCharging()){
	batterytext.textColor = new Color(ScarcityColor); //font color,电量不足字体颜色
}
	batterytext.textOpacity = BatteryTextOpacity; //opacity,不透明度
	batterytext.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Spacing between battery and summary
// 电量与天气、日期之间的间距
widgetHello.addSpacer(HSpacer);

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
let hStack2 = widgetHello.addStack();
	hStack2.layoutHorizontally();

// Centers line
hStack2.addSpacer(LeftSpacer);
// Widget feel temp
// 天气简报（最高温度与最低温度）
const feeltext =hStack2.addText(weathername + " 𝙩𝙤𝙙𝙖𝙮" + "." + " 𝙄𝙩 𝙛𝙚𝙚𝙡𝙨 𝙡𝙞𝙠𝙚 " + Math.round(feel_like) + UNITS + ";" + " 𝙩𝙝𝙚 𝙝𝙞𝙜𝙝 𝙬𝙞𝙡𝙡 𝙗𝙚 " + Math.round(highTemp) + UNITS);
	  feeltext.font = FeelTextFont; 
	  feeltext.textColor = new Color(FellTextColor);
	  feeltext.textOpacity = FellTextOpacity; 
	  feeltext.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// define horizontal stack
// 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
let hStack3 = widgetHello.addStack();
	hStack3.layoutHorizontally();

// Centers line
hStack3.addSpacer(LeftSpacer);//Left spacing,向左对齐间距

// Date label
// 日期
const datetext = hStack3.addText(datefull + "  ");
	  datetext.font = DateTextFont; 
	  datetext.textColor = new Color(DateTextColor); 
	  datetext.textOpacity = DateTextOpacity; 
	  datetext.leftAlignText(); //Align,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Weather icons in stack
// 天气图标
var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));
let widgetimg = hStack3.addImage(img); 
	widgetimg.imageSize = iconsSize; 
	widgetimg.leftAlignImage(); //Align,对齐方式(center,left,right)

// tempeture label in stack
// 温度
let temptext = hStack3.addText(Math.round(curTemp).toString()+UNITS);
	temptext.font = TempTextFont; 
	temptext.textColor = new Color(TempTextColor); 
	temptext.textOpacity = TempTextOpacity; 
	temptext.leftAlignText(); //AlignText,对齐方式(center,left,right)！在同一个stack内的对齐方式不能单独设置，只能调整向左对齐间距大小

// Bottom Spacer
// 底部间距
 widgetHello.addSpacer();
 widgetHello.setPadding( 0, 0, 0, 0)
 widgetHello.backgroundImage = widget.backgroundImage
 Script.setWidget(widgetHello)

//Script.complete()


/*
 * The code below this comment is used to set up the invisible widget.
 * 以下的代码用于设置小组件的 "透明背景"
 * ===================================================================
 */
} else {
  
  // Determine if user has taken the screenshot.
  // 确定用户是否有了屏幕截图。
  var message
  message = "开始之前，请返回主屏幕并长按进入编辑模式。滑动到最右边的空白页并截图。"
  let exitOptions = ["继续","退出以截图"]
  let shouldExit = await generateAlert(message,exitOptions)
  if (shouldExit) return
  
  // Get screenshot and determine phone size.
  // 获取屏幕截图并确定手机大小。
  let img = await Photos.fromLibrary()
  let height = img.size.height
  let phone = phoneSizes()[height]
  if (!phone) {
    message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次。"
    await generateAlert(message,["OK"])
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
    files.writeImage(path,imgCrop)
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
