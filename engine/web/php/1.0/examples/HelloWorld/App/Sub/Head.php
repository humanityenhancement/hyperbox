<?php
// I M P L E M E N T A T I O N
$HTML = $UI->With($Activity)->Tag("html")->Set();
$HEAD = $UI->With($Activity)->Tag("head")->Into($HTML);
$BODY = $UI->With($Activity)->Tag("body")->Attr("onselectstart", "return false")->Attr("ondragstart", "return false")->Into($HTML);

// H E A D
$UI->With($Activity)->Tag("meta")->Attr("charset", "UTF-8")->Into($HEAD);
$UI->With($Activity)->Tag("meta")->Attr("http-equiv", "X-UA-Compatible")->Attr("content", "IE=edge")->Into($HEAD);
$UI->With($Activity)->Tag("meta")->Attr("name", "viewport")->Attr("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no")->Into($HEAD);
$UI->With($Activity)->Tag("title")->Value("HelloWorld")->Into($HEAD);
$UI->With($Activity)->Tag("link")->Attr("rel", "stylesheet")->URL("Res/Style/Icon.css")->Into($HEAD);
$STYLE = $UI->With($Activity)->Tag("style")->Into($HEAD);

// S T Y L E
$UI->Selector($STYLE)->Update("\n\t\t* { margin: 0; padding: 0; border: 0; border-radius: 0; webkit-touch-callout: none; user-select: none; -webkit-user-select: none; -moz-user-select:none; -ms-user-select:none; outline: none; -webkit-tap-highlight-color: transparent; } ");
$UI->Selector($STYLE)->Update("\n\t\t::-webkit-scrollbar-thumb{ background: #666; border-radius: 4px; border: 2px solid #eee; } ::-webkit-scrollbar{ background: #eee; width: 8px; height: 6px; } ");
$UI->Selector($STYLE)->Update("\n\t\thtml, body { scrollbar-base-color: #666; scrollbar-arrow-color: #eee; scrollbar-track-color: #eee; color: #444; background: #eee; font-size: 15px; font-family: calibri; } a { color: #222; text-decoration: none; } i { color: #444; } ");
$UI->Selector($STYLE)->Update("\n\t\tinput { appearance: none; -webkit-appearance: none; -moz-appearance: none; -ms-appearance: none; } input:focus { outline-color: transparent; outline-style: none; } ");
$UI->Selector($STYLE)->Update("\n\t\tinput:-webkit-autofill { background: #fff; -webkit-text-fill-color: #222; box-shadow: 0 0 0px 1000px #fff inset; -webkit-box-shadow: 0 0 0px 1000px #fff inset; -moz-box-shadow: 0 0 0px 1000px #fff inset; } ");
$UI->Selector($STYLE)->Update("\n\t");

function Image($image) {
	return "Res" . "/" . "Image" . "/" . $image;
}
function Layout($layout = "home") {
	return "?" . "layout" . "=" . $layout;
}
?>