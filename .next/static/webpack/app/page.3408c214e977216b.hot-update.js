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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/Spotlight */ \"(app-pages-browser)/./components/ui/Spotlight.tsx\");\n/* harmony import */ var _Hero_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Hero.css */ \"(app-pages-browser)/./components/Hero.css\");\n/* harmony import */ var _ui_background_beams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/background-beams */ \"(app-pages-browser)/./components/ui/background-beams.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n // Import the CSS file for styling\n\nconst Hero = ()=>{\n    _s();\n    const [text, setText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const fullText = \"Hi, I'm Vivek.\";\n    const [showText, setShowText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [showButton, setShowButton] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isWideScreen, setIsWideScreen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // Initial state is false\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const handleResize = ()=>{\n            setIsWideScreen(window.innerWidth > 600);\n        };\n        // Set the initial state based on current window size\n        handleResize();\n        // Add event listener for resize\n        window.addEventListener(\"resize\", handleResize);\n        // Cleanup the event listener on component unmount\n        return ()=>{\n            window.removeEventListener(\"resize\", handleResize);\n        };\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        let index = 0;\n        const typingInterval = setInterval(()=>{\n            setText(fullText.substring(0, index + 1));\n            index += 1;\n            if (index === fullText.length) {\n                clearInterval(typingInterval);\n                setShowText(true); // Trigger secondary text effect\n            }\n        }, 95); // typing speed 95ms\n        return ()=>clearInterval(typingInterval); // Cleanup\n    }, [\n        fullText\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (showText) {\n            const timer = setTimeout(()=>{\n                setShowButton(true); // Show button after the secondary text is fully shown\n            }, 55); // Adjust delay as needed\n            return ()=>clearTimeout(timer); // Cleanup\n        }\n    }, [\n        showText\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative h-screen flex flex-col items-center justify-center text-center\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"relative h-full w-full\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"-top-20 -left-10 md:-left-32 h-screen\",\n                        fill: \"white\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 58,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"-top-1 -left-10 md:-left-32 h-screen\",\n                        fill: \"purple\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 59,\n                        columnNumber: 17\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_Spotlight__WEBPACK_IMPORTED_MODULE_2__.Spotlight, {\n                        className: \"top-15 -left-10 md:-left-32 h-screen\",\n                        fill: \"blue\"\n                    }, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 60,\n                        columnNumber: 17\n                    }, undefined),\n                    isWideScreen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ui_background_beams__WEBPACK_IMPORTED_MODULE_4__.BackgroundBeams, {}, void 0, false, {\n                        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                        lineNumber: 63,\n                        columnNumber: 34\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                lineNumber: 56,\n                columnNumber: 13\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"heroContainer\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"absolute inset-0 flex flex-col items-center justify-center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"text-4xl text-white mb-0.5\",\n                            children: text\n                        }, void 0, false, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 68,\n                            columnNumber: 21\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"secondaryText \".concat(showText ? \"show\" : \"\"),\n                            children: \"Software Engineer and Web Developer\"\n                        }, void 0, false, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 71,\n                            columnNumber: 21\n                        }, undefined),\n                        showButton && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: scrollDownByFullHeight,\n                            className: \"absolute bottom-16 inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 buttonFloat \".concat(showButton ? \"show\" : \"\"),\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                                    lineNumber: 81,\n                                    columnNumber: 29\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl\",\n                                    children: \"Explore My Work\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                                    lineNumber: 82,\n                                    columnNumber: 29\n                                }, undefined)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                            lineNumber: 77,\n                            columnNumber: 25\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                    lineNumber: 67,\n                    columnNumber: 17\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n                lineNumber: 66,\n                columnNumber: 13\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/vjmanoj/Portfolio-2/components/Hero.tsx\",\n        lineNumber: 55,\n        columnNumber: 9\n    }, undefined);\n};\n_s(Hero, \"8mj4uNw6C/7TDHa+2OmknEsG1mo=\");\n_c = Hero;\n// Function to scroll down by the height of the webpage\nconst scrollDownByFullHeight = ()=>{\n    const documentHeight = document.documentElement.scrollHeight;\n    window.scrollBy({\n        top: documentHeight,\n        behavior: \"smooth\"\n    });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Hero);\nvar _c;\n$RefreshReg$(_c, \"Hero\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvSGVyby50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ21EO0FBQ1I7QUFDdkIsQ0FBQyxrQ0FBa0M7QUFDQztBQUV4RCxNQUFNSyxPQUFPOztJQUNULE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHTiwrQ0FBUUEsQ0FBQztJQUNqQyxNQUFNTyxXQUFXO0lBQ2pCLE1BQU0sQ0FBQ0MsVUFBVUMsWUFBWSxHQUFHVCwrQ0FBUUEsQ0FBQztJQUN6QyxNQUFNLENBQUNVLFlBQVlDLGNBQWMsR0FBR1gsK0NBQVFBLENBQUM7SUFDN0MsTUFBTSxDQUFDWSxjQUFjQyxnQkFBZ0IsR0FBR2IsK0NBQVFBLENBQUMsUUFBUSx5QkFBeUI7SUFFbEZDLGdEQUFTQSxDQUFDO1FBQ04sTUFBTWEsZUFBZTtZQUNqQkQsZ0JBQWdCRSxPQUFPQyxVQUFVLEdBQUc7UUFDeEM7UUFFQSxxREFBcUQ7UUFDckRGO1FBRUEsZ0NBQWdDO1FBQ2hDQyxPQUFPRSxnQkFBZ0IsQ0FBQyxVQUFVSDtRQUVsQyxrREFBa0Q7UUFDbEQsT0FBTztZQUNIQyxPQUFPRyxtQkFBbUIsQ0FBQyxVQUFVSjtRQUN6QztJQUNKLEdBQUcsRUFBRTtJQUVMYixnREFBU0EsQ0FBQztRQUNOLElBQUlrQixRQUFRO1FBQ1osTUFBTUMsaUJBQWlCQyxZQUFZO1lBQy9CZixRQUFRQyxTQUFTZSxTQUFTLENBQUMsR0FBR0gsUUFBUTtZQUN0Q0EsU0FBUztZQUNULElBQUlBLFVBQVVaLFNBQVNnQixNQUFNLEVBQUU7Z0JBQzNCQyxjQUFjSjtnQkFDZFgsWUFBWSxPQUFPLGdDQUFnQztZQUN2RDtRQUNKLEdBQUcsS0FBSyxvQkFBb0I7UUFFNUIsT0FBTyxJQUFNZSxjQUFjSixpQkFBaUIsVUFBVTtJQUMxRCxHQUFHO1FBQUNiO0tBQVM7SUFFYk4sZ0RBQVNBLENBQUM7UUFDTixJQUFJTyxVQUFVO1lBQ1YsTUFBTWlCLFFBQVFDLFdBQVc7Z0JBQ3JCZixjQUFjLE9BQU8sc0RBQXNEO1lBQy9FLEdBQUcsS0FBSyx5QkFBeUI7WUFDakMsT0FBTyxJQUFNZ0IsYUFBYUYsUUFBUSxVQUFVO1FBQ2hEO0lBQ0osR0FBRztRQUFDakI7S0FBUztJQUViLHFCQUNJLDhEQUFDb0I7UUFBSUMsV0FBVTs7MEJBQ1gsOERBQUNEO2dCQUFJQyxXQUFVOztrQ0FFWCw4REFBQzNCLG9EQUFTQTt3QkFBQzJCLFdBQVU7d0JBQXdDQyxNQUFLOzs7Ozs7a0NBQ2xFLDhEQUFDNUIsb0RBQVNBO3dCQUFDMkIsV0FBVTt3QkFBdUNDLE1BQUs7Ozs7OztrQ0FDakUsOERBQUM1QixvREFBU0E7d0JBQUMyQixXQUFVO3dCQUF1Q0MsTUFBSzs7Ozs7O29CQUdoRWxCLDhCQUFnQiw4REFBQ1QsaUVBQWVBOzs7Ozs7Ozs7OzswQkFHckMsOERBQUN5QjtnQkFBSUMsV0FBVTswQkFDWCw0RUFBQ0Q7b0JBQUlDLFdBQVU7O3NDQUNYLDhEQUFDRDs0QkFBSUMsV0FBVTtzQ0FDVnhCOzs7Ozs7c0NBRUwsOERBQUN1Qjs0QkFBSUMsV0FBVyxpQkFBd0MsT0FBdkJyQixXQUFXLFNBQVM7c0NBQU07Ozs7Ozt3QkFLMURFLDRCQUNHLDhEQUFDcUI7NEJBQ0dDLFNBQVNDOzRCQUNUSixXQUFXLDRMQUFxTixPQUF6Qm5CLGFBQWEsU0FBUzs7OENBRTdOLDhEQUFDd0I7b0NBQUtMLFdBQVU7Ozs7Ozs4Q0FDaEIsOERBQUNLO29DQUFLTCxXQUFVOzhDQUE0Sjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTeE07R0FwRk16QjtLQUFBQTtBQXNGTix1REFBdUQ7QUFDdkQsTUFBTTZCLHlCQUF5QjtJQUMzQixNQUFNRSxpQkFBaUJDLFNBQVNDLGVBQWUsQ0FBQ0MsWUFBWTtJQUU1RHZCLE9BQU93QixRQUFRLENBQUM7UUFDWkMsS0FBS0w7UUFDTE0sVUFBVTtJQUNkO0FBQ0o7QUFFQSwrREFBZXJDLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9IZXJvLnRzeD9lNzc5Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFNwb3RsaWdodCB9IGZyb20gJy4vdWkvU3BvdGxpZ2h0JztcbmltcG9ydCAnLi9IZXJvLmNzcyc7IC8vIEltcG9ydCB0aGUgQ1NTIGZpbGUgZm9yIHN0eWxpbmdcbmltcG9ydCB7IEJhY2tncm91bmRCZWFtcyB9IGZyb20gJy4vdWkvYmFja2dyb3VuZC1iZWFtcyc7XG5cbmNvbnN0IEhlcm8gPSAoKSA9PiB7XG4gICAgY29uc3QgW3RleHQsIHNldFRleHRdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IGZ1bGxUZXh0ID0gXCJIaSwgSSdtIFZpdmVrLlwiO1xuICAgIGNvbnN0IFtzaG93VGV4dCwgc2V0U2hvd1RleHRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzaG93QnV0dG9uLCBzZXRTaG93QnV0dG9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbaXNXaWRlU2NyZWVuLCBzZXRJc1dpZGVTY3JlZW5dID0gdXNlU3RhdGUoZmFsc2UpOyAvLyBJbml0aWFsIHN0YXRlIGlzIGZhbHNlXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVSZXNpemUgPSAoKSA9PiB7XG4gICAgICAgICAgICBzZXRJc1dpZGVTY3JlZW4od2luZG93LmlubmVyV2lkdGggPiA2MDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNldCB0aGUgaW5pdGlhbCBzdGF0ZSBiYXNlZCBvbiBjdXJyZW50IHdpbmRvdyBzaXplXG4gICAgICAgIGhhbmRsZVJlc2l6ZSgpO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgcmVzaXplXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xuXG4gICAgICAgIC8vIENsZWFudXAgdGhlIGV2ZW50IGxpc3RlbmVyIG9uIGNvbXBvbmVudCB1bm1vdW50XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfTtcbiAgICB9LCBbXSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBjb25zdCB0eXBpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHNldFRleHQoZnVsbFRleHQuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkpO1xuICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0eXBpbmdJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgc2V0U2hvd1RleHQodHJ1ZSk7IC8vIFRyaWdnZXIgc2Vjb25kYXJ5IHRleHQgZWZmZWN0XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDk1KTsgLy8gdHlwaW5nIHNwZWVkIDk1bXNcblxuICAgICAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0eXBpbmdJbnRlcnZhbCk7IC8vIENsZWFudXBcbiAgICB9LCBbZnVsbFRleHRdKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzaG93VGV4dCkge1xuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRTaG93QnV0dG9uKHRydWUpOyAvLyBTaG93IGJ1dHRvbiBhZnRlciB0aGUgc2Vjb25kYXJ5IHRleHQgaXMgZnVsbHkgc2hvd25cbiAgICAgICAgICAgIH0sIDU1KTsgLy8gQWRqdXN0IGRlbGF5IGFzIG5lZWRlZFxuICAgICAgICAgICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0aW1lcik7IC8vIENsZWFudXBcbiAgICAgICAgfVxuICAgIH0sIFtzaG93VGV4dF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLXNjcmVlbiBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLWZ1bGwgdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgey8qIHRoZSBmbGFzaGluZyBsaWdodHMgZnJvbSB0aGUgdG9wIGxlZnQgKi99XG4gICAgICAgICAgICAgICAgPFNwb3RsaWdodCBjbGFzc05hbWU9XCItdG9wLTIwIC1sZWZ0LTEwIG1kOi1sZWZ0LTMyIGgtc2NyZWVuXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8U3BvdGxpZ2h0IGNsYXNzTmFtZT1cIi10b3AtMSAtbGVmdC0xMCBtZDotbGVmdC0zMiBoLXNjcmVlblwiIGZpbGw9XCJwdXJwbGVcIiAvPlxuICAgICAgICAgICAgICAgIDxTcG90bGlnaHQgY2xhc3NOYW1lPVwidG9wLTE1IC1sZWZ0LTEwIG1kOi1sZWZ0LTMyIGgtc2NyZWVuXCIgZmlsbD1cImJsdWVcIiAvPlxuXG4gICAgICAgICAgICAgICAgey8qIHRoZSBzaG9vdGluZyBzdGFycyBpbiB0aGUgYmFja2Ryb3AgKi99XG4gICAgICAgICAgICAgICAge2lzV2lkZVNjcmVlbiAmJiA8QmFja2dyb3VuZEJlYW1zIC8+fVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVyb0NvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtNHhsIHRleHQtd2hpdGUgbWItMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGV4dH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2Vjb25kYXJ5VGV4dCAke3Nob3dUZXh0ID8gJ3Nob3cnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTb2Z0d2FyZSBFbmdpbmVlciBhbmQgV2ViIERldmVsb3BlclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICB7LyogQnV0dG9uIHRvIHNjcm9sbCBkb3duIHRvIGJlbnRvIGJveCAqL31cbiAgICAgICAgICAgICAgICAgICAge3Nob3dCdXR0b24gJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3Njcm9sbERvd25CeUZ1bGxIZWlnaHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYWJzb2x1dGUgYm90dG9tLTE2IGlubGluZS1mbGV4IGgtMTIgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtZnVsbCBwLVsycHhdIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1zbGF0ZS00MDAgZm9jdXM6cmluZy1vZmZzZXQtMiBmb2N1czpyaW5nLW9mZnNldC1zbGF0ZS01MCBidXR0b25GbG9hdCAke3Nob3dCdXR0b24gPyAnc2hvdycgOiAnJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LVstMTAwMCVdIGFuaW1hdGUtW3NwaW5fMnNfbGluZWFyX2luZmluaXRlXSBiZy1bY29uaWMtZ3JhZGllbnQoZnJvbV85MGRlZ19hdF81MCVfNTAlLCNFMkNCRkZfMCUsIzM5M0JCMl81MCUsI0UyQ0JGRl8xMDAlKV1cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGgtZnVsbCB3LWZ1bGwgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtZnVsbCBiZy1zbGF0ZS05NTAgcHgtMyBweS0xIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBiYWNrZHJvcC1ibHVyLTN4bFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeHBsb3JlIE15IFdvcmtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vLyBGdW5jdGlvbiB0byBzY3JvbGwgZG93biBieSB0aGUgaGVpZ2h0IG9mIHRoZSB3ZWJwYWdlXG5jb25zdCBzY3JvbGxEb3duQnlGdWxsSGVpZ2h0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGRvY3VtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodDtcblxuICAgIHdpbmRvdy5zY3JvbGxCeSh7XG4gICAgICAgIHRvcDogZG9jdW1lbnRIZWlnaHQsXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBIZXJvO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJTcG90bGlnaHQiLCJCYWNrZ3JvdW5kQmVhbXMiLCJIZXJvIiwidGV4dCIsInNldFRleHQiLCJmdWxsVGV4dCIsInNob3dUZXh0Iiwic2V0U2hvd1RleHQiLCJzaG93QnV0dG9uIiwic2V0U2hvd0J1dHRvbiIsImlzV2lkZVNjcmVlbiIsInNldElzV2lkZVNjcmVlbiIsImhhbmRsZVJlc2l6ZSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImluZGV4IiwidHlwaW5nSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInN1YnN0cmluZyIsImxlbmd0aCIsImNsZWFySW50ZXJ2YWwiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJkaXYiLCJjbGFzc05hbWUiLCJmaWxsIiwiYnV0dG9uIiwib25DbGljayIsInNjcm9sbERvd25CeUZ1bGxIZWlnaHQiLCJzcGFuIiwiZG9jdW1lbnRIZWlnaHQiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbEhlaWdodCIsInNjcm9sbEJ5IiwidG9wIiwiYmVoYXZpb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Hero.tsx\n"));

/***/ })

});