<?php
class Engine {
	public function Build() {
		return new class() {
			public $VERSION = "1.0";
			public $NAME = "Hypebox Engine";
			public $AUTHOR = "Heri Kaniugu";
			public $DESCRIPTION = "A Lightweight PHP Framework for Everyone. Copyright (c) 2019, Hyperbox Technologies.";
		};
	}
	public static function Import() {
		return new class() {
			public static function App() { Engine::App(); return new static(); }
			public static function DB() { Engine::DB(); return new static(); }
			public static function UI() { Engine::UI(); return new static(); }
		};
	}
	public static function App() {
		global $App;
		$App = new class() {
			private $source;
			public function Activity($version = "1.0", $unicode = "UTF-8") {
				$activity = new DOMDocument($version, $unicode);
				$implementation = new DOMImplementation();
				$activity->appendChild($implementation->createDocumentType("html"));
				return $activity;
			}
			public function Source($source) {
				$this->source = $source;
				return $this;
			}
			public function Layout($layout, $alternative = null) {
				$layout = $this->source . "/" . ucfirst($layout ? $layout : $alternative) . "." . "php";
				return is_readable($layout) ? $layout : $this->source . "/" . 404 . "." . "php" ;
			}
			public function Run($activity) {
				$activity->formatOutput = true; $tags = "script|style|i|div|textarea";
				echo @preg_replace("/(.+?\n)/", '', @preg_replace("/<(" . $tags . ")(.*)\/>/", "<$1$2></$1>", $activity->saveXML()), 1);
				return $this;
			}
		};
		return $App;
	}
	public static function DB() {
		global $DB;
		$DB = new class() {
			public static function Create() {
				return new class() {
					private static $host, $name, $username, $password, $charset = "utf8";
					public function Host($host) { self::$host = $host; return new static(); }
					public function Name($name) { self::$name = $name; return new static(); }
					public function Username($username) { self::$username = $username; return new static(); }
					public function Password($password) { self::$password = $password; return new static(); }
					public function Charset($charset) { self::$charset = $charset; return new static(); }
					public function Done() {
						return new PDO("mysql:host=" . self::$host . "; dbname=" . self::$name . ";charset=" . self::$charset, 
							self::$username, self::$password);
					}
				};
			}
			public function SQL() {
				return new class() {
					private $database, $query;
					public function Database($database) {
						$this->database = $database;
						return $this;
					}
					public function Query($query) {
						$this->query = $this->database->prepare($query);
						return $this;
					}
					public function Params($params = array()) {
						$this->query->execute($params);
						return $this;
					}
					public function Count() {
						return $this->query->rowCount();
					}
					public function Get($fetch = null) {
						return $this->query->fetch($fetch);
					}
					public function getAll($fetch = null) {
						return $this->query->fetchAll($fetch);
					}
					public function getColumn($fetch = null) {
						return $this->query->fetchColumn($fetch);
					}
				};
			}
		};
		return $DB;
	}
	public static function UI() {
		global $UI;
		$UI = new class() {
			private $activity, $tag;
			public function With($activity) {
				$this->activity = $activity;
				return $this;
			}
			public function Selector($tag) {
				$this->tag = $tag;
				return $this;
			}
			public function Tag($name) {
				$this->tag = $this->activity->createElement($name);
				return $this;
			}
			public function Newline() {
				$this->tag = $this->activity->createElement("br");
				return $this;
			}
			public function Div() {
				$this->tag = $this->activity->createElement("div");
				return $this;
			}
			public function Image() {
				$this->tag = $this->activity->createElement("img");
				return $this;
			}
			public function Input() {
				$this->tag = $this->activity->createElement("input");
				return $this;
			}
			public function Textarea() {
				$this->tag = $this->activity->createElement("textarea");
				return $this;
			}
			public function Button() {
				$this->tag = $this->activity->createElement("button");
				return $this;
			}
			public function Value($value = null) {
				$this->tag->nodeValue = $value;
				return $this;
			}
			public function Attr($key, $value = null) {
				$this->tag->setAttribute($key, $value);
				return $this;
			}
			public function ID($value) {
				$this->Attr("id", $value);
				return $this;
			}
			public function URL($value) {
				$this->Attr("href", $value);
				return $this;
			}
			public function Action($value) {
				$this->Attr("action", $value);
				return $this;
			}
			public function Method($value) {
				$this->Attr("method", $value);
				return $this;
			}
			public function Name($value) {
				$this->Attr("name", $value);
				return $this;
			}
			public function Placeholder($value) {
				$this->Attr("placeholder", $value);
				return $this;
			}
			public function Type($value) {
				$this->Attr("type", $value);
				return $this;
			}
			public function Source($value) {
				$this->Attr("src", $value);
				return $this;
			}
			public function Style($value) {
				$this->Attr("style", $value);
				return $this;
			}
			public function Into($activity) {
				$activity->appendChild($this->tag);
				return $this->tag;
			}
			public function Insert($value) {
				$this->tag->nodeValue = $value;
				return $this;
			}
			public function Before($tag) {
				$this->tag->parentNode->insertBefore($tag, $this->tag->nextSibling);
				return $this;
			}
			public function After($tag) {
				$this->tag->parentNode->insertBefore($tag, $this->tag->parentNode->firstChild);
				return $this;
			}
			public function Update($value) {
				$this->tag->nodeValue = $this->tag->nodeValue . $value;
				return $this;
			}
			public function Add($tag) {
				$this->tag->appendChild($tag);
				return $this;
			}
			public function Set() {
				$this->activity->appendChild($this->tag);
				return $this->tag;
			}
			public function Get() {
				return $this->tag;
			}
		};
		return $UI;
	}
	public static function Device() {
		global $Device;
		$Device = new class() {
			public function Mobile() {
				$UA1 = '/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|' . 
					'elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|' .
					'opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|' . 
					'treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i';
				$UA2 = '/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|' . 
					'al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|' . 
					'be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|' . 
					'cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|' . 
					'em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|' . 
					'gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|' . 
					'iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|' . 
					'le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|' . 
					'mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|' . 
					'n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|' . 
					'pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|' . 
					'qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|' . 
					'mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|' . 
					't6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|' . 
					'veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|' . 
					'wmlb|wonu|x700|yas\-|your|zeto|zte\-/i';
				return @preg_match($UA1, @$_SERVER['HTTP_USER_AGENT']) || @preg_match($UA2, @substr(@$_SERVER['HTTP_USER_AGENT'], 0, 4));
			}
		};
		return $Device;
	}
}
?>