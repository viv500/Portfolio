"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./components/Hero.tsx":
/*!*****************************!*\
  !*** ./components/Hero.tsx ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/Spotlight */ \"(app-pages-browser)/./components/ui/Spotlight.tsx\");\n/* harmony import */ var _Hero_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Hero.css */ \"(app-pages-browser)/./components/Hero.css\");\n/* harmony import */ var _ui_background_beams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/background-beams */ \"(app-pages-browser)/./components/ui/background-beams.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n // Import the CSS file for styling\n\nconst Hero = ()=>{\n    _s();\n    const [text, setText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const fullText = \"Hi, I'm Vivek.\";\n    const [showText, setShowText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [showButton, setShowButton] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        let index = 0;\n        const typingInterval = setInterval(()=>{\n            setText(fullText.substring(0, index + 1));\n            index += 1;\n            if (index === fullText.length) {\n                clearInterval(typingInterval);\n                setShowText(true); // Trigger secondary text effect\n            }\n        }, 95); // typing speed 95ms\n        return ()=>clearInterval(typingInterval); // Cleanup\n    }, [\n        fullText\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (showText) {\n            const timer = setTimeout(()=>{\n                setShowButton(true); // Show button after the secondary text is fully shown\n            }, 1000); // Adjust delay as needed\n            return ()=>clearTimeout(timer); // Cleanup\n        }\n    }, [\n        showText\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative h-screen flex flex-col items-center justify-center text-center\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"relative h-full w-full\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"-top-20 -left-10 md:-left-32 h-screen\",\n                        fill: \"white\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 41,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"-top-1 -left-10 md:-left-32 h-screen\",\n                        fill: \"purple\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 42,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"top-15 -left-10 md:-left-32 h-screen\",\n                        fill: \"blue\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 43,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mobile\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_background_beams__WEBPACK_IMPORTED_MODULE_4__.BackgroundBeams, {}, void 0, false, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 46,\n                            columnNumber: 21\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 45,\n                        columnNumber: 17\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                lineNumber: 38,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"heroContainer\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"absolute inset-0 flex flex-col items-center justify-center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"text-4xl text-white mb-0.5\",\n                            children: text\n                        }, void 0, false, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 53,\n                            columnNumber: 21\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"secondaryText \".concat(showText ? \"show\" : \"\"),\n                            children: \"Software Engineer and Web Developer\"\n                        }, void 0, false, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 56,\n                            columnNumber: 21\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                    lineNumber: 52,\n                    columnNumber: 17\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                lineNumber: 51,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n        lineNumber: 37,\n        columnNumber: 9\n    }, undefined);\n};\n_s(Hero, \"bqPHSKev+wrEuVbzIsCUNN9Dmzo=\");\n_c = Hero;\n// Function to scroll down by the height of the webpage\nconst scrollDownByFullHeight = ()=>{\n    // Get the height of the entire document\n    const documentHeight = document.documentElement.scrollHeight;\n    // Scroll down by the height of the document\n    window.scrollBy({\n        top: documentHeight,\n        behavior: \"smooth\" // Makes the scrolling smooth\n    });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Hero);\nvar _c;\n$RefreshReg$(_c, \"Hero\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvSGVyby50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ21EO0FBQ1I7QUFDdkIsQ0FBQyxrQ0FBa0M7QUFDQztBQUV4RCxNQUFNSyxPQUFPOztJQUNULE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHTiwrQ0FBUUEsQ0FBQztJQUNqQyxNQUFNTyxXQUFXO0lBQ2pCLE1BQU0sQ0FBQ0MsVUFBVUMsWUFBWSxHQUFHVCwrQ0FBUUEsQ0FBQztJQUN6QyxNQUFNLENBQUNVLFlBQVlDLGNBQWMsR0FBR1gsK0NBQVFBLENBQUM7SUFFN0NDLGdEQUFTQSxDQUFDO1FBQ04sSUFBSVcsUUFBUTtRQUNaLE1BQU1DLGlCQUFpQkMsWUFBWTtZQUMvQlIsUUFBUUMsU0FBU1EsU0FBUyxDQUFDLEdBQUdILFFBQVE7WUFDdENBLFNBQVM7WUFDVCxJQUFJQSxVQUFVTCxTQUFTUyxNQUFNLEVBQUU7Z0JBQzNCQyxjQUFjSjtnQkFDZEosWUFBWSxPQUFPLGdDQUFnQztZQUN2RDtRQUNKLEdBQUcsS0FBSyxvQkFBb0I7UUFFNUIsT0FBTyxJQUFNUSxjQUFjSixpQkFBaUIsVUFBVTtJQUMxRCxHQUFHO1FBQUNOO0tBQVM7SUFFYk4sZ0RBQVNBLENBQUM7UUFDTixJQUFJTyxVQUFVO1lBQ1YsTUFBTVUsUUFBUUMsV0FBVztnQkFDckJSLGNBQWMsT0FBTyxzREFBc0Q7WUFDL0UsR0FBRyxPQUFPLHlCQUF5QjtZQUNuQyxPQUFPLElBQU1TLGFBQWFGLFFBQVEsVUFBVTtRQUNoRDtJQUNKLEdBQUc7UUFBQ1Y7S0FBUztJQUViLHFCQUNJLDhEQUFDYTtRQUFJQyxXQUFVOzswQkFDWCw4REFBQ0Q7Z0JBQUlDLFdBQVU7O2tDQUdYLDhEQUFDcEIsb0RBQVNBO3dCQUFDb0IsV0FBVTt3QkFBd0NDLE1BQUs7Ozs7OztrQ0FDbEUsOERBQUNyQixvREFBU0E7d0JBQUNvQixXQUFVO3dCQUF1Q0MsTUFBSzs7Ozs7O2tDQUNqRSw4REFBQ3JCLG9EQUFTQTt3QkFBQ29CLFdBQVU7d0JBQXVDQyxNQUFLOzs7Ozs7a0NBRWpFLDhEQUFDRjt3QkFBSUMsV0FBVTtrQ0FDWCw0RUFBQ25CLGlFQUFlQTs7Ozs7Ozs7Ozs7Ozs7OzswQkFLeEIsOERBQUNrQjtnQkFBSUMsV0FBVTswQkFDWCw0RUFBQ0Q7b0JBQUlDLFdBQVU7O3NDQUNYLDhEQUFDRDs0QkFBSUMsV0FBVTtzQ0FDVmpCOzs7Ozs7c0NBRUwsOERBQUNnQjs0QkFBSUMsV0FBVyxpQkFBd0MsT0FBdkJkLFdBQVcsU0FBUztzQ0FBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXL0U7R0E1RE1KO0tBQUFBO0FBOEROLHVEQUF1RDtBQUN2RCxNQUFNb0IseUJBQXlCO0lBQzNCLHdDQUF3QztJQUN4QyxNQUFNQyxpQkFBaUJDLFNBQVNDLGVBQWUsQ0FBQ0MsWUFBWTtJQUU1RCw0Q0FBNEM7SUFDNUNDLE9BQU9DLFFBQVEsQ0FBQztRQUNaQyxLQUFLTjtRQUNMTyxVQUFVLFNBQVMsNkJBQTZCO0lBQ3BEO0FBQ0o7QUFFQSwrREFBZTVCLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9IZXJvLnRzeD9lNzc5Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFNwb3RsaWdodCB9IGZyb20gJy4vdWkvU3BvdGxpZ2h0JztcbmltcG9ydCAnLi9IZXJvLmNzcyc7IC8vIEltcG9ydCB0aGUgQ1NTIGZpbGUgZm9yIHN0eWxpbmdcbmltcG9ydCB7IEJhY2tncm91bmRCZWFtcyB9IGZyb20gJy4vdWkvYmFja2dyb3VuZC1iZWFtcyc7XG5cbmNvbnN0IEhlcm8gPSAoKSA9PiB7XG4gICAgY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IGZ1bGxUZXh0ID0gXCJIaSwgSSdtIFZpdmVrLlwiO1xuICAgIGNvbnN0IFtzaG93VGV4dCwgc2V0U2hvd1RleHRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzaG93QnV0dG9uLCBzZXRTaG93QnV0dG9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGNvbnN0IHR5cGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGV4dChmdWxsVGV4dC5zdWJzdHJpbmcoMCwgaW5kZXggKyAxKSk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBmdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHR5cGluZ0ludGVydmFsKTtcbiAgICAgICAgICAgICAgICBzZXRTaG93VGV4dCh0cnVlKTsgLy8gVHJpZ2dlciBzZWNvbmRhcnkgdGV4dCBlZmZlY3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgOTUpOyAvLyB0eXBpbmcgc3BlZWQgOTVtc1xuXG4gICAgICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKHR5cGluZ0ludGVydmFsKTsgLy8gQ2xlYW51cFxuICAgIH0sIFtmdWxsVGV4dF0pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNob3dUZXh0KSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFNob3dCdXR0b24odHJ1ZSk7IC8vIFNob3cgYnV0dG9uIGFmdGVyIHRoZSBzZWNvbmRhcnkgdGV4dCBpcyBmdWxseSBzaG93blxuICAgICAgICAgICAgfSwgMTAwMCk7IC8vIEFkanVzdCBkZWxheSBhcyBuZWVkZWRcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpOyAvLyBDbGVhbnVwXG4gICAgICAgIH1cbiAgICB9LCBbc2hvd1RleHRdKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1zY3JlZW4gZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1mdWxsIHctZnVsbFwiPlxuXG4gICAgICAgICAgICAgICAgey8qIHRoZSBmbGFzaGluZyBsaWdodHMgZnJvbSB0aGUgdG9wIGxlZnQgKi99XG4gICAgICAgICAgICAgICAgPFNwb3RsaWdodCBjbGFzc05hbWU9XCItdG9wLTIwIC1sZWZ0LTEwIG1kOi1sZWZ0LTMyIGgtc2NyZWVuXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8U3BvdGxpZ2h0IGNsYXNzTmFtZT1cIi10b3AtMSAtbGVmdC0xMCBtZDotbGVmdC0zMiBoLXNjcmVlblwiIGZpbGw9XCJwdXJwbGVcIiAvPlxuICAgICAgICAgICAgICAgIDxTcG90bGlnaHQgY2xhc3NOYW1lPVwidG9wLTE1IC1sZWZ0LTEwIG1kOi1sZWZ0LTMyIGgtc2NyZWVuXCIgZmlsbD1cImJsdWVcIiAvPlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2JpbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPEJhY2tncm91bmRCZWFtcyAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvQ29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC00eGwgdGV4dC13aGl0ZSBtYi0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0ZXh0fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BzZWNvbmRhcnlUZXh0ICR7c2hvd1RleHQgPyAnc2hvdycgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNvZnR3YXJlIEVuZ2luZWVyIGFuZCBXZWIgRGV2ZWxvcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vLyBGdW5jdGlvbiB0byBzY3JvbGwgZG93biBieSB0aGUgaGVpZ2h0IG9mIHRoZSB3ZWJwYWdlXG5jb25zdCBzY3JvbGxEb3duQnlGdWxsSGVpZ2h0ID0gKCkgPT4ge1xuICAgIC8vIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBlbnRpcmUgZG9jdW1lbnRcbiAgICBjb25zdCBkb2N1bWVudEhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQ7XG5cbiAgICAvLyBTY3JvbGwgZG93biBieSB0aGUgaGVpZ2h0IG9mIHRoZSBkb2N1bWVudFxuICAgIHdpbmRvdy5zY3JvbGxCeSh7XG4gICAgICAgIHRvcDogZG9jdW1lbnRIZWlnaHQsXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyAvLyBNYWtlcyB0aGUgc2Nyb2xsaW5nIHNtb290aFxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBIZXJvO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJTcG90bGlnaHQiLCJCYWNrZ3JvdW5kQmVhbXMiLCJIZXJvIiwidGV4dCIsInNldFRleHQiLCJmdWxsVGV4dCIsInNob3dUZXh0Iiwic2V0U2hvd1RleHQiLCJzaG93QnV0dG9uIiwic2V0U2hvd0J1dHRvbiIsImluZGV4IiwidHlwaW5nSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInN1YnN0cmluZyIsImxlbmd0aCIsImNsZWFySW50ZXJ2YWwiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJkaXYiLCJjbGFzc05hbWUiLCJmaWxsIiwic2Nyb2xsRG93bkJ5RnVsbEhlaWdodCIsImRvY3VtZW50SGVpZ2h0IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJzY3JvbGxIZWlnaHQiLCJ3aW5kb3ciLCJzY3JvbGxCeSIsInRvcCIsImJlaGF2aW9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Hero.tsx\n"));

/***/ })

});