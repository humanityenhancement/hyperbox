window.Engine = {
	V: new Object(),
	App: {
		Title: function(a) { return a ? document.title : document.title = a ; },
		URL: function(a) { return a ? window.location[a] : window.location.href ; },
		Width: window.innerWidth,
		Height: window.innerHeight,
		On: Object.prototype.On = function(a) {
			var selector = this; window.listen ? null : window.listen = 0 ;
			return {
				Response: function(b) {
					for(var i = 0; i < a.split(" ").length; i++) { 
						selector["on" + a.split(" ")[i]] = b;
					}
					return window.listen++;
				}
			}
		},
		Manifest: function (a) {
			a.version ? Engine.App.Config.VERSION = a.version : null ;
			a.name ? Engine.App.Config.NAME = a.name : null ;
			a.author ? Engine.App.Config.AUTHOR = a.author : null ;
			a.description ? Engine.App.Config.DESCRIPTION = a.description : null ;
			a.icon ? Engine.App.Config.ICON = a.icon : null ;
			a.icon ? Engine.UI.Tag("LINK").Into("head").
				Attr({ rel: "shortcut icon", type: "image/x-icon", "href": a.icon }).Done() : null ;
		},
		Resources: function(A) {
			return {
				Array: function (a) {
					var b = [];
					for(var i = 0; i < a.length; i++) {
						b[a[i]] = (A ? A : Engine.App.Config.FLAVOR) + a[i];
					}
					return b;
				}
			};
		},
		Open: function(a, b, c, d) {
			return window.open(a, b, c, d);
		},
		Reload: function() {
			return null == window.location.reload();
		},
		Back: function() {
			return null == window.history.back();
		},
		Go: function(a) {
			return null == window.history.go(a);
		},
		Config: {
			VERSION: null, NAME: null, AUTHOR: null, DESCRIPTION: null, ICON: null, DEBUG: true, FLAVOR: ""
		},
		Script: function(a, b) {
			var N = Engine.App.Config.DEBUG ? "?" + Random(100000) : Engine.App.Config.FLAVOR ;
			var A = document.createElement("script"); a ? A.src = a + N : null ; A.onload = function() { b ? b() : null ; };
			document.documentElement.appendChild(A); return A;
		},
		Resize: window.addEventListener("resize", function() {
			Engine.App.Width = window.innerWidth;
			Engine.App.Height = window.innerHeight;
		}),
		Orientation: window.addEventListener("orientationchange", function() {
			function resize() {
				Engine.App.Width = window.innerWidth;
				Engine.App.Height = window.innerHeight;
			}
			resize();
			switch(window.orientation) {
				case -90 || 90: break; default: resize(); break;
			}
		})
	},
	File: {
		Preload: {
			Image: function(array) {
				return {
					Response:  function(callback, error) {
						var A = new Array(), images = new Array(), count = array.length;
						for(var i = 0; i < count; i++) {
							A[i] = new Image();
							A[i].onerror = function(e) { error ? error(e) : null ; };
							A[i].onload = function(a) {
								return function() {
									var filename = a.src.replace(/^.*[\\\/]/, ''); count--;
									images.push([filename, a]); callback ? callback(filename, a, count) : null;
								}
							} (A[i]);
							A[i].src = array[i];
						}
						return images;
					}
				};
			},
			Audio: function(array) {
				return {
					Response:  function(callback, error) {
						var A = new Array(), files = new Array(), count = array.length;
						for(var i = 0; i < count; i++) {
							A[i] = new Audio(array[i]);
							A[i].onerror = function(e) { error ? error(e) : null ; };
							A[i].preload = true;
							A[i].oncanplaythrough = function(a) {
								var filename = a.src.replace(/^.*[\\\/]/, ''); count--;
								files.push([filename, a]); callback ? callback(filename, a, count) : null;
							} (A[i]);
						}
						return files;
					}
				};
			},
			Array: function(array) {
				return {
					Response:  function(callback, error) {
						var A = new Array(), data = new Array(), count = array.length, index = 0;
						for(var i = 0; i < count; i++) {
							A[i] = new (XMLHttpRequest||ActiveXObject)("MSXML2.XMLHTTP.3.0");
							A[i].open("GET", array[i], true); A[i].responseType = "arraybuffer";
							A[i].onerror = function(event) { error ? error(event) : null ; };
							A[i].onload = function(a) {
								var buffer = this.response, filename = array[index].replace(/^.*[\\\/]/, ''); count--; index++;
								data.push([filename, buffer]); callback ? callback(filename, buffer, count) : null ;
							};
							A[i].send();
						}
						return data;
					}
				};
			}
		},
		Read: function(event, type) {
			return {
				Response: function(callback, error) {
					var A = new Array(), files = event.target.files, index = 0;
					for(var i = 0; i < files.length; i++) {
						A[i] = new FileReader();
						A[i].onerror = function(event) { error ? error(event) : null ; };
						A[i].onload = function() {
							var buffer = this.result, url = Engine.Util.Convert.fromArrayBufferToURL(buffer);
							callback ? callback(buffer, url, index) : null ; index++;
						};
						A[i].readAsArrayBuffer(type ? new Blob([files[i]], { "type": type }) : files[i]);
					}
					return files;
				}
			};
		}
	},
	Import: function(a) {
		var A = a && typeof a === "string" ? a.split(".") : new Array() ;
		if(A.length > 1) {
			var b = Engine[A[0]][A[1]]; for (var c in b) { b.hasOwnProperty(c) ? window[c] = b[c] : null ; }
			return window[A[1]] = b;
		} else {
			var b = (a == "*" ? this : Engine[a]); for (var c in b) { b.hasOwnProperty(c) ? window[c] = b[c] : null ; }
			return window[a] = b;
		}
	},
	Root: {
		Equals: Object.prototype.Equals = function(a, b) {
			var A = b ? b : this ; return A == a ? true : false ;
		},
		Contains: Object.prototype.Contains = function(a, b) {
			var A = b ? b : this ; return A.indexOf(a) >= 0 ? true : false ;
		},
		Translate: Object.prototype.Translate = function(a, b) {
			 var A = b ? b : this ; index = A[0].indexOf(a); return index >= 0 ? A[1][index] : a ;
		},
		Size: Object.prototype.Size = function(a) {
			var size = 0, key, obj = a ? a : this ;
			for (key in obj) { obj.hasOwnProperty(key) ? size++ : null ; }
			return size;
		},
		Loop: Object.prototype.Loop = function(a, array) {
			var array = array ? array : this;
			for (b in array) { array.hasOwnProperty(b) ? a && a((parseInt(b) ? parseInt(b) : b), array[b]) : null; }
			return this;
		},
		Remove: Object.prototype.Remove = function(item, array) {
			var array = array ? array : this;
			for(var i in array) {
				if(array[i] == item) { array.splice(i, 1); break; }
			}
			return array;
		},
		Merge: window.Merge = function(a) {
			return {
				Array: function(b) {
					return a && b.indexOf(a) === -1 ? b.concat(a) : b ;
				},
				Object: function(b) {
					for(c in b) {  a && b.hasOwnProperty(c) ? a[c] = b[c] : null ; }
					return a;
				}
			}
		},
		If: window.If = function(a) {
			return {
				Then: function(b) {
					a && b ? b() : null ; return this;
				},
				Else: function(b) {
					a && b ? null : b() ; return this;
				}
			}
		},
		Random: window.Random = function(a, b) {
			return b ? Math.floor(Math.random() * (b - a + 1)) + a : Math.floor(Math.random() * (a ? a : 1000)) ;
		},
		Wait: window.Wait = function(a, b) {
			return window.setTimeout(a, b ? b : 1500);
		},
		Repeat: window.Repeat = function(a, b, c) {
			var d = 0, e = window.setInterval(function() {
				a ? a(d) : null ; if (++d === c) { window.clearInterval(e); }
			}, b ? b : 1500);
			return e;
		},
		Parse: window.Parse = {
			JSON: function(a) {
				return a && typeof a === "string" ? JSON.parse(a) : a ;
			},
			XML: function(a) {
				return new DOMParser().parseFromString(a, "text/xml"); 
			}, HTML: function(a) {
				return new DOMParser().parseFromString(a, "text/html"); 
			}
		}
	},
	Net: {
		Load: function(action, data) {
			return {
				Response: function(callback, error) {
					var a = action, b = data, c = error, d = Engine.App.Config.FLAVOR;
					var N = Engine.App.Config.DEBUG ? "?" + Random(100000) : Engine.App.Config.FLAVOR ;
					var A = new (XMLHttpRequest||ActiveXObject) ("MSXML2.XMLHTTP.3.0");
					try {
						a.title ? document.title = a.title : null ;
						a.title ? window.history.pushState(null, a.title, (a.url ? a.url : d) ) : null ;
						if(typeof a === "object") {
							a.type ? A.responseType = a.type : null ;
							b ? A.open("POST", a.url + N, true) : A.open("GET", a.url + N, true) ;
							b ? A.setRequestHeader("Content-type", "application/x-www-form-urlencoded") : null ;
						} else {
							A.open("GET", a + N, true);
						}
						A.onload = function() {
							if(this.readyState == 4) {
								try {
									if(this.status == 200 || this.status == 304) {
										var res = this.response ? this.response : this.responseText ;
										res = ( a.type == "json" && typeof res !== "object" ? Parse.JSON(res) : res ) ;
										callback ? callback(res) :  null ;
									} else {
										c ? c(this.statusText) : null ;
									}
								} catch(e) { c ? c(e) : null ; }
							}
						};
						if(b && typeof b === "object") {
							A.send(Engine.Net.Param(b));
						} else {
							A.send(); 
						}
					} catch(e) { c ? c(e) : null ; }
					return this;
				}
			};
		},
		Include: function(a) {
			var A = document.createElement("iframe"); a ? A.src = a : null ;
			document.head.appendChild(A);
			return {
				Response: function(b) {
					A.onload = function(e) {
						b ? b(this.contentWindow || this.contentDocument, e) : null ;
					};
					return A;
				}
			};
		},
		Param: function(a) { 
			return (typeof a === "string") ? a : Object.keys(a).map(function(k) {
				return encodeURIComponent(k) + "=" + encodeURIComponent(a[k]);
			}).join("&");
		}
	},
	Speech: {
		Recognizer: function(a) {
			var b = window.SpeechRecognition || window.webkitSpeechRecognition || 
				window.mozSpeechRecognition || window.msSpeechRecognition;
			if(a && b) {
				var b = new b();
				b.interimResults = false;
				b.lang = "en-US";
				b.onresult = function(e) { a(e.results[0][0].transcript); };
				b.start();
			}
			return b;
		},
		Synthesizer: function(a) {
			var b = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance || 
				window.mozSpeechSynthesisUtterance || window.msSpeechSynthesisUtterance;
			if(a && b) {
				var c = new b();
				c.text = a.text ? a.text : a ;
				c.pitch = a.pitch ? a.pitch : 2 ;
				c.rate = a.rate ? a.rate : 1 ;
				c.volume = a.volume ? a.volume : 1 ;
				c.lang = a.lang ? a.lang : "en-US" ;
				c.voice = speechSynthesis.getVoices().filter(function(voice) {
					return voice.name == a.voice ? a.voice : "Agnes" ; 
				})[0];
				speechSynthesis.speak(c);
			}
			return b;
		}
	},
	UI: {
		Selector: function(a) {
			return document.querySelector(a) ? document.querySelector(a) : false ;
		},
		Tag: function(tag) {
			var A = document.createElement(tag), O = null;
			return {
				Get: function() { 
					return A;
				},
				Text: function(text) {
					text ? A.innerText = text : null ; return this;
				},
				Content: function(text) {
					text ? A.textContent = text : null ; return this;
				},
				HTML: function(html) {
					html ? A.innerHTML = html : null ; return this;
				},
				Value: function(value) {
					value ? A.value = value : null ; return this;
				},
				URL: function(url) {
					url ? A.src = url : null ; return this;
				},
				Attr: function(a, b) {
					if(a && b) {
						A.setAttribute(a, b);
					} else if(a) {
						for (var z in a) { a.hasOwnProperty(z) ? A.setAttribute(z, a[z]) : null ; }
					}
					return this;
				},
				Width: function(width) {
					A.style.width = width; return this;
				},
				Height: function(height) {
					A.style.height = height; return this;
				},
				Style: function(css) {
					A.style.cssText += css; return this;
				},
				ID: function(id) {
					A.id = id; return this;
				},
				Class: function(a) {
					A.setAttribute("class", a); return this;
				},
				Into: function(into) {
					O = into; return this;
				},
				Done: function() {
					Engine.UI.Selector(O) ? Engine.UI.Selector(O).appendChild(A) : document.body.appendChild(A) ;
					return this;
				}
			}
		},
		Text: function(text) {
			return Tag("SPAN").Text(text).Done();
		},
		Article: function(article) {
			return Tag("P").Content(article).Done();
		},
		Section: function(section) {
			return Tag("DIV").Content(section).Done();
		},
		Style: function(style) {
			return Tag("STYLE").Content(style).Into("HEAD").Done();
		},
		Media: {
			Image: function(image) {
				return Tag("IMG").URL(image).Done();
			},
			Audio: function(audio) {
				return Tag("AUDIO").URL(image).Done();
			},
			Video: function(video) {
				return Tag("VIDEO").URL(video).Done();
			}
		},
		Document: {
			Get: function(O) {
				var A = Engine.UI.Selector(O), Z = Engine.App.Config.FLAVOR;
				return {
					Text: function() {
						return A ? A.innerText : Z ;
					},
					Content: function() {
						return A ? A.textContent : Z ;
					},
					HTML: function() {
						return A ? A.innerHTML : Z ;
					},
					Value: function() {
						return A ? A.value : Z ;
					},
					URL: function() {
						return A ? A.src : Z ;
					},
					Attr: function(a) {
						return A ? A.getAttribute(a) : Z ;
					},
					Style: function() {
						return A ? A.style.cssText : Z ;
					}
				};
			},
			Set: function(O) {
				var A = Engine.UI.Selector(O); 
				return {
					Text: function(a) {
						A.innerText = a; return A ? true : false ;
					},
					Content: function(a) {
						A.textContent = a; return A ? true : false ;
					},
					HTML: function(a) {
						A.innerHTML = a; return A ? true : false ;
					},
					Value: function(a) {
						A.value = a; return A ? true : false ;
					},
					URL: function(a) {
						A.src = a; return A ? true : false ;
					},
					Attr: function(a, b) {
						A.setAttribute(a, b); return A ? true : false ;
					},
					Style: function(a) {
						A.style.cssText = a; return A ? true : false ;
					}
				};
			},
			Add: function(O) {
				var A = Engine.UI.Selector(O); 
				return {
					Text: function(a) {
						A.innerText += a; return A ? true : false ;
					},
					Content: function(a) {
						A.textContent += a; return A ? true : false ;
					},
					HTML: function(a) {
						A.innerHTML += a; return A ? true : false ;
					},
					Value: function(a) {
						A.value += a; return A ? true : false ;
					},
					URL: function(a) {
						A.src += a; return A ? true : false ;
					},
					Attr: function(a, b) {
						A.setAttribute(a, A.getAttribute(a) + b); return A ? true : false ;
					},
					Style: function(a) {
						A.style.cssText += a; return A ? true : false ;
					}
				};
			},
			Replace: function(O) {
				var A = Engine.UI.Selector(O);
				return {
					Text: function(a, b) {
						A ? A.innerText = A.innerText.replace(a, b) : null ; return A ? true : false ;
					},
					Content: function(a, b) {
						A ? A.textContent = A.textContent.replace(a, b) : null ; return A ? true : false ;
					},
					HTML: function(a, b) {
						A ? A.innerHTML = A.innerHTML.replace(a, b) : null ; return A ? true : false ;
					},
					Value: function(a, b) {
						A ? A.value = A.value.replace(a, b) : null ; return A ? true : false ;
					},
					URL: function(a, b) {
						A ? A.src = A.src.replace(a, b) : null ; return A ? true : false ;
					},
					Attr: function(a, b, c) {
						A ? A.setAttribute(a, A.getAttribute(a).replace(b, c)) : null ; return A ? true : false ;
					},
					Style: function(a, b) {
						A ? A.style.cssText = A.style.cssText.replace(a, b) : null ; return A ? true : false ;
					}
				};
			},
			Toggle: function(O) {
				var A = Engine.UI.Selector(O);
				return {
					Text: function(a, b) {
						var Z = A.innerText; A ? A.innerText = (Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a)) : null ;
						return A ? true : false ;
					},
					Content: function(a, b) {
						var Z = A.textContent; A ? A.textContent = (Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a)) : null ;
						return A ? true : false ;
					},
					HTML: function(a, b) {
						var Z = A.innerHTML; A ? A.innerHTML = (Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a)) : null ;
						return A ? true : false ;
					},
					Value: function(a, b) {
						var Z = A.value; A ? A.value = (Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a)) : null ;
						return A ? true : false ;
					},
					URL: function(a, b) {
						var Z = A.src; A ? A.src = (Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a)) : null ;
						return A ? true : false ;
					},
					Attr: function(a, b, c) {
						var Z = A.getAttribute(a), N = A ? ( Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a) ) : null ;
						A ? A.setAttribute(a, N) : null ; return A ? true : false ;
					},
					Style: function(a, b) {
						var Z = A.style.cssText, N = A ? ( Z.indexOf(a) >= 0 ? Z.replace(a, b) : Z.replace(b, a) ) : null ;
						A ? A.style.cssText = N : null ; return A ? true : false ;
					}
				};
			},
			Clear: function(O) {
				var A = Engine.UI.Selector(O), Z = Engine.App.Config.FLAVOR;
				return {
					Text: function() {
						A.innerText = Z; return A ? true : false ;
					},
					Content: function() {
						A.textContent = Z; return A ? true : false ;
					},
					HTML: function() {
						A.innerHTML = Z; return A ? true : false ;
					},
					Value: function() {
						A.value = Z; return A ? true : false ;
					},
					URL: function() {
						A.src = Z; return A ? true : false ;
					},
					Attr: function(a) {
						A.removeAttribute(a); return A ? true : false ;
					},
					Style: function(a) {
						A.style.cssText = Z; return A ? true : false ;
					}
				};
			}
		},
		Style: function(a) {
			Engine.UI.Selector("HEAD>STYLE") ? Engine.UI.Document.Add("HEAD>STYLE").Text(a) : 
				Engine.UI.Tag("STYLE").Text(a).Into("HEAD").Done() ;
			return this;
		},
		Atom: function(O) {
			Engine.UI.Selector("HEAD>STYLE") ? null : Engine.UI.Tag("STYLE").Into("HEAD").Done() ;
			var style = new Array();
			function Z(a, b) {
				var array = a.split(":");
				if(array.length > 1) {
					for(var i = 0; i < array.length; i++) {
						style.push(array[i] + ":" + b);
					}
				} else {
					style.push(a + ":" + b);
				}
			}
			return {
				C: function(a) { Z("color", a); return this; },
				BG: function(a) { Z("background", a); return this; },
				W: function(a) { Z("width", a); return this; },
				H: function(a) { Z("height", a); return this; },
				P: function(a) { Z("padding", a); return this; },
				M: function(a) { Z("margin", a); return this; },
				TA: function(a) { Z("text-align", a); return this; },
				VA: function(a) { Z("vertical-align", a); return this; },
				T: function(a) { Z("top", a); return this; },
				B: function(a) { Z("bottom", a); return this; },
				R: function(a) { Z("right", a); return this; },
				L: function(a) { Z("left", a); return this; },
				FF: function(a) { Z("font-family", a); return this; },
				FS: function(a) { Z("font-size", a); return this; },
				FW: function(a) { Z("font-weight", a); return this; },
				TD: function(a) { Z("text-decoration", a); return this; },
				TI: function(a) { Z("text-indent", a); return this; },
				D: function(a) { Z("display", a); return this; },
				F: function(a) { Z("float", a); return this; },
				O: function(a) { Z("opacity", a); return this; },
				CO: function(a) { Z("content", a); return this; },
				OV: function(a) { Z("overflow", a); return this; },
				OF: function(a) { Z("object-fit", a); return this; },
				OS: function(a) { Z("-webkit-overflow-scrolling", a); return this; },
				OX: function(a) { Z("overflow-x", a); return this; },
				OY: function(a) { Z("overflow-y", a); return this; },
				OL: function(a) { Z("outline", a); return this; },
				OLC: function(a) { Z("outline-color", a); return this; },
				OLS: function(a) { Z("outline-style", a); return this; },
				WW: function(a) { Z("word-wrap", a); return this; },
				PO: function(a) { Z("position", a); return this; },
				BGI: function(a) { Z("background-image", a); return this; },
				CU: function(a) { Z("cursor", a); return this; },
				BGS: function(a) { Z("background-size", a); return this; },
				BGP: function(a) { Z("background-position", a); return this; },
				BGC: function(a) { Z("background-clip", a); return this; },
				B: function(a) { Z("border", a); return this; },
				BT: function(a) { Z("border-top", a); return this; },
				BB: function(a) { Z("border-bottom", a); return this; },
				BR: function(a) { Z("border-right", a); return this; },
				BX: function(a) { Z("border-radius", a); return this; },
				V: function(a) { Z("visibility", a); return this; },
				PT: function(a) { Z("padding-top", a); return this; },
				PB: function(a) { Z("padding-bottom", a); return this; },
				PR: function(a) { Z("padding-right", a); return this; },
				PL: function(a) { Z("padding-left", a); return this; },
				MT: function(a) { Z("margin-top", a); return this; },
				MB: function(a) { Z("margin-bottom", a); return this; }, 
				MR: function(a) { Z("margin-right", a); return this; },
				ML: function(a) { Z("margin-left", a); return this; }, 
				CL: function(a) { Z("clear", a); return this; },
				RE: function(a) { Z("resize", a); return this; },
				MAW: function(a) { Z("max-width", a); return this; },
				MAH: function(a) { Z("max-height", a); return this; },
				MAH: function(a) { Z("max-height", a); return this; },
				MIH: function(a) { Z("min-height", a); return this; },
				WS: function(a) { Z("white-space", a); return this; },
				TC: function(a) { Z("webkit-touch-callout", a); return this; },
				TFC: function(a) { Z("text-fill-color", a); return this; },
				THC: function(a) { Z("-webkit-tap-highlight-color", a); return this; },
				SBC: function(a) { Z("scrollbar-base-color", a); return this; },
				SAC: function(a) { Z("scrollbar-arrow-color", a); return this; },
				STC: function(a) { Z("scrollbar-track-color", a); return this; },
				AD: function(a) { Z("animation-delay:-webkit-animation-delay", a); return this; },
				BS: function(a) { Z("box-shadow:-webkit-box-shadow:-moz-box-shadow", a); return this; },
				A: function(a) { Z("animation:-webkit-animation:-ms-animation", a); return this; },
				TF: function(a) { Z("transform:-webkit-transform:-ms-transform", a); return this; },
				US: function(a) { Z("user-select:-webkit-user-select:-moz-user-select:-ms-user-select", a); return this; },
				AP: function(a) { Z("appearance:-webkit-appearance:-moz-appearance:-ms-appearance", a); return this; },
				Done: function() {
					var A = O + style.join(";").replace(/((\w|[^\w])+)/g, "\{$1\} ");
					Engine.UI.Document.Replace("HEAD>STYLE").Text(A, Engine.App.Config.FLAVOR);
					Engine.UI.Document.Add("HEAD>STYLE").Text(A); return this;
				}
			}
		}
	},
	Util: {
		Log: Object.prototype.Log = function(a, b) {
			b ? console.log(a, b) : console.log(a) ; return true;
		},
		Error: Object.prototype.Error = function(a, b) {
			b ? console.error(a, b) : console.error(a) ; return true;
		},
		Convert: {
			fromBlobToURL: function(blob) {
				var O = window.URL || window.webkitURL || window.mozURL || window.msURL;
				return O.createObjectURL(blob);
			},
			fromArrayBufferToBlob: function(arrayBuffer) {
				return new Blob([new Uint8Array(arrayBuffer)]);
			},
			fromArrayBufferToURL: function(arrayBuffer) {
				var O = window.URL || window.webkitURL || window.mozURL || window.msURL;
				return O.createObjectURL(new Blob([new Uint8Array(arrayBuffer)]));
			}
		},
		Cache: {
			Get: function(a) {
				var Z = Engine.App.Config.FLAVOR;
				try {
					var A = window.atob(localStorage.getItem(window.btoa(a)));
					return a && localStorage.getItem(window.btoa(a)) ? A : Z ;
				} catch(e) {
					return Z;
				}
			},
			Set: function(a, b) {
				try {
					a && b ? localStorage.setItem(window.btoa(a), window.btoa(b)) : null ;
					return true;
				} catch(e) {
					return false;
				}
			}
		}
	},
	Web: {
		Audio: function() {
			window.audioContext = window.audioContext ? window.audioContext : 
				new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext) ();
			var O = window.audioContext;
			return {
				Context: function() { return O; },
				Clear: function() { O.close(); O = null; return this; },
				Decode: function(response, callback, error) {
					O.decodeAudioData(response, function(buffer) { callback ? callback(buffer) : null ; }).
						then(function() { }).catch(function(e) { error ? error(e) : null ; });
					return this;
				},
				Create: {
					Media: function(a) {
						var audio = document.querySelector(a);
						var A = O.createMediaElementSource(audio);
						return {
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							}
						};
					},
					Analyser: function() {
						var A = O.createAnalyser(), data = new Uint8Array(A.frequencyBinCount);
						return {
							Size: function(a) {
								A.fftSize = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							},
							Array: function(a) {
								return data;
							},
							Update: function(callback) {
								requestAnimationFrame(update);
								A.getByteFrequencyData(data);
								callback ? callback(data) : null ;
								return this;
							}
						};
					},
					Oscillator: function() {
						var A = O.createOscillator();
						return {
							Frequency: function(a) {
								A.frequency.value = a; return this;
							},
							Type: function(a) {
								A.type = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							},
							Start: function(a) {
								A.start(a?a:0); return this;
							},
							Stop: function(a) {
								A.stop(a?a:0); return this;
							},
							Time: function(a) {
								return O.currentTime + (a ? a : 0);
							},
							On: {
								Ended: function(callback) {
									A.onended = function() {
										A.disconnect(O.destination);
										callback ? callback() : null ;
									}
									return this;
								}
							}
						}
					},
					Buffer: function() {
						var A = O.createBufferSource();
						return {
							Value: function(a) {
								A.buffer = a; return this;
							},
							Rate: function(a) {
								A.playbackRate.value = a; return this;
							},
							Detune: function(a) {
								A.detune.value = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							},
							Start: function(a) {
								A.start(a?a:0); return this;
							},
							Stop: function(a) {
								A.stop(a?a:0); return this;
							},
							Time: function(a) {
								return O.currentTime + (a ? a : 0);
							},
							On: {
								Ended: function(callback) {
									A.onended = function() {
										A.disconnect(O.destination);
										callback ? callback() : null ;
									}
									return this;
								}
							}
						}
					},
					Delay: function() {
						var A = O.createDelay();
						return {
							Frequency: function(a) {
								A.delayTime.value = (a/2000)/2; return this;
							},
							Value: function(a) {
								A.delayTime.value = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							}
						};
					},
					Gain: function() {
						var A = O.createGain();
						return {
							Value: function(a) {
								A.gain.value = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							}
						};
					},
					BiquadFilter: function() {
						var A = O.createBiquadFilter();
						return {
							Frequency: function(a) {
								A.frequency.value = a; return this;
							},
							Type: function(a) {
								A.type = a; return this;
							},
							Connect: function(a) {
								A.connect(a?a:O.destination); return this;
							}
						};
					}
				}
			};
		},
		Canvas: function(width, height) {
			var A = document.createElement("canvas"), O = A.getContext("2d"), frame = 0, frames = 0;
			width ? A.width = width : null ; height ? A.height = height : null ;
			return {
				Context: function() { return O; },
				ID: function(a) { a ? A.id = a : null ; return this; },
				Width: function(a) {
					a ? A.width = a : null ; return a ? this : A.width ;
				},
				Height: function(a) {
					a ? A.height = a : null ; return a ? this : A.height ;
				},
				Attr: function(a, b) {
					a && b ? A.setAttribute(a, b) : null ; return b ? this : A.getAttribute(a) ;
				},
				Into: function(a) {
					Engine.UI.Selector(a) ? Engine.UI.Selector(a).appendChild(A) : document.body.appendChild(A) ;
					return this;
				},
				Clear: function(w, h) {
					O ? O.clearRect(0, 0, w ? w : A.width, h ? h : A.height) : null ; return this;
				},
				Viewport: function(x, y) {
					O.setTransform(1, 0, 0, 1, 0, 0); O.translate(x, y); return this;
				},
				Transform: function(a) {
					O.setTransform(a.scale[0], a.skew[0], a.skew[1], a.scale[1], a.move[0], a.move[0]); return this;
				},
				Line: function(a) {
					a.linewidth ? O.lineWidth = a.linewidth : null ; a.linecap ? O.lineCap = a.linecap : null ; 
					a.moveto ? O.moveTo(a.moveto[0], a.moveto[1]) : null; a.lineto ? O.lineTo(a.lineto[0], a.lineto[1]) : null ;
					a.strokestyle ? O.strokeStyle = a.strokestyle : null ; a.strokestyle ? O.stroke() : null ; 
					a.strokerect ? O.strokeRect(a.strokerect[0], a.strokerect[1], a.strokerect[2], a.strokerect[3]) : null ; 
					return this;
				},
				Text: function(a) {
					var Wrap = function(text, x, y, maxWidth, lineHeight) {
						var words = text.toString().split(' '), line = Engine.App.Config.FLAVOR;
						for(var n = 0; n < words.length; n++) {
							var line2 = line + words[n] + ' ', width = O.measureText(line2).width;
							if (width > maxWidth && n > 0) {
								O.fillText(line.trim(), x, y);
								a.stroke ? O.strokeText(line.trim(), x, y) : null;
								line = words[n] + ' ';
								y += lineHeight;
							} else {
								line = line2;
							}
						}
						O.fillText(line.trim(), x, y);
						a.stroke ? O.strokeText(line.trim(), x, y) : null;
					};
					var width = (a.width ? a.width : O.measureText(a.text).width), 
						height = (a.height ? a.height : parseInt(a.font)), p = a.padding||0;
					var dx = a.x - (a.align == "right" ? width : (a.align == "center" ? width / 2 : 0)) - p, dy = a.y - height/2 - p;
					a.rect ? O.fillStyle = a.rect : null ; a.rect ? O.fillRect(dx, dy, width + p * 2, height + p * 2) : null ;
					a.font ? O.font = a.font : null ; O.textBaseline = "middle"; a.align ? O.textAlign = a.align : null ;
					a.fill ? O.fillStyle = a.fill: null ; a.stroke? O.strokeStyle = a.stroke: null ;
					a.text ? Wrap(a.text, a.x, a.y, this.width, height) : null; a.obj.width = width; a.obj.height = height;
					return { x: dx, y: dy, width: width + p * 2, height: height + p * 2 };
				},
				Rectangle: function(a) {
					O.beginPath(); O.rect(a.rect[0], a.rect[1], a.rect[2], a.rect[3]);
					a.fillstyle? O.fillStyle = a.fillstyle : null ; a.fillstyle ? O.fill() : null ;
					return this;
				},
				Circle: function(a) {
					O.beginPath(); O.arc(a.arc[0], a.arc[1], a.arc[2], 0, Math.PI*2);
					a.fillstyle ? O.fillStyle = a.fillstyle : null ; a.fillstyle ? O.fill() : null ; a.strokestyle? O.stroke() : null ;
					O.lineWidth = a.linewidth; a.strokestyle? O.strokeStyle = a.strokestyle : null;
					return this;
				},
				Gradient: function(a) {
					if(a.linear) {
						var G = O.createLinearGradient(a.linear[0], a.linear[1], a.linear[2], a.linear[3]);
					} else if(a.radical) {
						var G = O.createRadialGradient(a.radical[0], a.radical[1], 
							a.radical[2], a.radical[3], a.radical[4], a.radical[5]);
					}
					a.addcolor ? G.addColorStop(0, a.addcolor[0]) : null ;
					a.addcolor ? G.addColorStop(1, a.addcolor[1]) : null ;
					O.beginPath(); a.rect ? O.rect(a.rect[0], a.rect[1], a.rect[2], a.rect[3]) : null ;
					a.rect ? O.fillStyle = G : null ; a.rect ? O.fill() : null ;
					return this;
				},
				Image: function(image) {
					function waiter(n) {
					    if ((frames / n) % 1 == 0) { return true; } else { return false; }
					}
					return {
						Render: function(a) {
							if(a && a.width && a.height) {
								O.drawImage(image, 0, 0, image.width, image.height, 
									(a && a.x ? a.x : 0), (a && a.y ? a.y : 0), a.width, a.height);
							} else {
								O.drawImage(image, (a && a.x ? a.x : 0), (a && a.y ? a.y : 0));
							}
							return image;
						},
						Animate: function(x, y, width, height, rows, cols, speed) {
							var ax = 0, ay = 0; frames += 1;
							if (frames == 1 || waiter(speed)) { frame = ++frame % cols; } 
							ax = frame * width/cols; x += speed;
							O.drawImage(image, ax, ay, width/cols, height/rows, x, y, width/cols, height/rows);
							return image;
						},
						Rotate: function(a) {
							if(a && a.width && a.height) {
								O.save();
								O.translate((a&&a.x?a.x:0), (a&&a.y?a.y:0));
								O.rotate(a.rotation * Math.PI/180);
								O.drawImage(I, -(a.width/2), -(a.height/2));
								O.restore();
							}
							return image;
						}
					};
				},
				Cache: function(callback) {
					var Z = document.createElement("canvas"), N = Z.getContext("2d");
					Z.width = O.canvas.width; Z.height = O.canvas.height;
					N.drawImage(O.canvas, 0, 0); callback ? callback(this) : null ; O.drawImage(N.canvas, 0, 0);
					return this;
				}
			};
		},
		Graphics: function(width, height) {
			var A = document.createElement("canvas"), O = A.getContext("webgl") || A.getContext("experimental-webgl");
			width ? A.width = width : null ; height ? A.height = height : null ;
			return {
				Context: function() { return O; },
				ID: function(a) { a ? A.id = a : null ; return this; },
				Width: function(a) { a ? A.width = a : null ; return this; },
				Height: function(a) { a ? A.height = a : null ; return this; },
				Attr: function(a, b) { a && b ? A.setAttribute(a, b) : null ; return this; },
				Into: function(a) {
					Engine.UI.Selector(a) ? Engine.UI.Selector(a).appendChild(A) : document.body.appendChild(A) ;
					return this;
				},
				Shader: function() {
					var Z = document.createElement("script"); document.head.appendChild(Z);
					return {
						Type: function(a) { a ? Z.setAttribute("type", a) : null ; return this; },
						Script: function(a) { a ? Z.textContent = a : null ; return this; },
						Get: function() { a ? Z.firstChild.nodeValue : null ; },
						Create: function(a, b) {
							var v = O.createShader(O.VERTEX_SHADER);
							O.shaderSource(v, a); O.compileShader(vertex);
							var f = O.createShader(O.FRAGMENT_SHADER);
							O.shaderSource(f, b); O.compileShader(f);
							var p = O.createProgram();
							O.attachShader(p, v); O.attachShader(p, f); O.linkProgram(p);
							return { PROGRAM: p, VERTEX: v, FRAGMENT: f };
						}
					};
				}
			};
		}
	},
	Device : {
		Mobile: function(a) {
			var a = (a) ? a : 640, b = navigator.userAgent || navigator.vendor || window.opera;
			return window.orientation >- 1 || screen.width <= a || 
				(window.matchMedia && 
					window.matchMedia("only screen and (max-width: "+a+"px)").matches) || 
				/Mobi/i.test(b) || !(/Windows NT|Macintosh|Mac OS X|Linux/i.test(b)) || 
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(b) || 
				/Opera Mini|Opera Mobile|Kindle|Windows Phone|PSP/i.test(b) || 
				/AvantGo|Atomic Web Browser|Blazer|Chrome Mobile/i.test(b) || 
				/Dolphin|Dolfin|Doris|GO Browser|Jasmine|MicroB/i.test(b) || 
				/Mobile Firefox|Mobile Safari|Mobile Silk|Motorola Internet Browser/i.test(b) || 
				/NetFront|NineSky|Nokia Web Browser|Obigo|Openwave Mobile Browser/i.test(b) || 
				/Palm Pre web browser|Polaris|PS Vita browser|Puffin|QQbrowser/i.test(b) || 
				/SEMC Browser|Skyfire|Tear|TeaShark|UC Browser|uZard Web/i.test(b) || 
				/wOSBrowser|Yandex.Browser mobile/i.test(b);
		},
		Fullscreen: function(a) {
			var A = document.documentElement;
			if(A.requestFullscreen) {
				if(document.fullScreenElement) {
					document.cancelFullScreen(); a ? screen.orientation.unlock() : null ;
				} else {
					A.requestFullscreen(); Engine.Device.Mobile() && a ? screen.orientation.lock(a) : null ;
				}
				return A.requestFullscreen;
			} else if(A.msRequestFullscreen) {
				document.msFullscreenElement ? document.msExitFullscreen() : A.msRequestFullscreen() ;
				return A.msRequestFullscreen;
			} else if(A.mozRequestFullScreen) {
				if(document.mozFullScreenElement) {
					document.mozCancelFullScreen(); a ? screen.orientation.unlock() : null ;
				} else {
					A.mozRequestFullScreen(); Engine.Device.Mobile() && a ? screen.orientation.lock(a) : null ;
				}
				return A.mozRequestFullscreen;
			} else if (A.webkitRequestFullscreen) {
				if (document.webkitFullscreenElement) {
					document.webkitCancelFullScreen(); a ? screen.orientation.unlock() : null ;
				} else {
					A.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
					Engine.Device.Mobile() && a ? screen.orientation.lock(a) : null ;
				}
				return A.webkitRequestFullscreen;
			}
			return false;
		}
	},
	Build: {
		VERSION: "1.0",
		NAME: "Hypebox Engine",
		AUTHOR: "Heri Kaniugu",
		DESCRIPTION: "A Lightweight Javascript Framework for Everyone. Copyright (c) 2019, Hyperbox Technologies."
	}
};