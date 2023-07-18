var NTP = {
    printpage: '#printthispage',
    raAgencies: '#raAgencies',
    actualHostname: window.location.hostname.toLowerCase(),
    productionHostnames: [
        'ntp',
        'www.ntp',
        'ntp.niehs.nih.gov',
        'www.ntp.niehs.nih.gov',
        'tools.niehs.nih.gov',
        'ntpsearch',
        'ntpsearch.niehs.nih.gov',
        'edit',
    ],
    devHostNames: [
        'ntpdev',
        'ntpdev.niehs.nih.gov',
        'apps2dev.niehs.nih.gov',
        'tools2dev.niehs.nih.gov',
        'ntpsearch-dev',
        'ntpsearch-dev.niehs.nih.gov',
        'edit-dev',
    ],
    testHostNames: [
        'ntptest',
        'ntptest.niehs.nih.gov',
        'apps2tst.niehs.nih.gov',
        'tools2tst.niehs.nih.gov',
        'ntpsearch-test',
        'ntpsearch-test.niehs.nih.gov',
        'edit-tst',
    ],
    environment: 'Prod',
    PublicSiteHostName: 'https://ntp.niehs.nih.gov',
    isProduction: false,
};

// check to see if we're on production
for (var i = 0; i < NTP.devHostNames.length; i++) {
    if (NTP.actualHostname === NTP.devHostNames[i]) {
        NTP.environment = 'Dev';
        NTP.PublicSiteHostName = 'https://ntpdev.niehs.nih.gov';
        break;
    }
}
for (var i = 0; i < NTP.testHostNames.length; i++) {
    if (NTP.actualHostname === NTP.testHostNames[i]) {
        NTP.environment = 'Test';
        NTP.PublicSiteHostName = 'https://ntptest.niehs.nih.gov';
        break;
    }
}
for (var i = 0; i < NTP.productionHostnames.length; i++) {
    if (NTP.actualHostname === NTP.productionHostnames[i]) {
        NTP.environment = 'Prod';
        NTP.PublicSiteHostName = 'https://ntp.niehs.nih.gov';
        NTP.isProduction = true;
        break;
    }
}

// prevent cross-frame scripting by forcing the document to be the top - only for production instance
if (top != self) top.location = self.location;

$(function() {
    // register print this page event.
    $(NTP.printpage)
        .attr('href', '#')
        .click(function() {
            window.print();
        });

    //register regulatory actions event.
    $(NTP.raAgencies).change(function() {
        location.href = '#' + $(this).val();
    });
});

/*  this removes placeholder text before printing - Added by Mark Colebank 5/8/2015 
called in body tag on forms <body onbeforeprint="removePlaceholder()"> */
function removePlaceholder() {
    $('input').removeAttr('placeholder');
    $('textarea').removeAttr('placeholder');
}

//adds IE support for includes() JS method - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

//define external link disclaimer title attribute; used within ntp.footer.js and ntp.external-links.js
var ntpExternalDisclaimer =
    'This link is to a non-NTP website. Links do not constitute endorsement by NTP of the linked website. Visitors to the linked website will be subject to the website privacy policies. These practices may be different than those of this NTP website.';
// ===============================================================
// Footer (requires jQuery, ntp.common.js, & Foundation MediaQuery)
// ===============================================================
$(document).ready(function() {
    function footerMobile() {
        $('.link-category ul').hide();
        $('.link-category h5')
            .unbind('click keyup')
            .attr('tabindex', '0')
            .on({
                click: function() {
                    $(this)
                        .next('ul')
                        .slideToggle();
                    $(this).toggleClass('footer-nav-active');
                },
                keyup: function(event) {
                    if (event.keyCode == 13) {
                        $(this).click();
                    }
                },
            });
    }
    function footerDesktop() {
        $('.link-category h5')
            .removeAttr('tabindex')
            .off('click keyup');
        $('.link-category ul').show();
    }

    //trigger at breakpoint
    onFooterMobile = function() {
        if (Foundation.MediaQuery.is('small only')) {
            footerMobile();
        } else {
            footerDesktop();
        }
    };

    //on page load and media query change, initialize onFooterMobile();
    $(window).on('load changed.zf.mediaquery', onFooterMobile);

    //add title attribute to external links in the footer
    $('#footer a.external, .footer-logos a').attr('title', ntpExternalDisclaimer);
});
('use strict');
/*jslint browser: true*/
/*global  $*/
// Javascript for Thunderstone search
$(function() {
    // default id to query
    var ids = $('[id^=query]').filter('.queryAutocomplete');
    // add autocomplete
    for (var i = 0; i < ids.length; i++) {
        var id = $('[id^=query]').filter('.queryAutocomplete')[i].id;
        autoComplete(id);
    }
    function autoComplete(id) {
        $('#' + id + '.queryAutocomplete').autocomplete({
            source: function(request, response) {
                var action = $('#' + id + '')
                    .closest('form')
                    .attr('action');
                var url = '//seek.niehs.nih.gov/texis/autocomplete.json';
                var profile = 'ntp';
                $.ajax({
                    dataType: 'jsonp',
                    url: url,
                    data: {
                        pr: profile,
                        term: request.term,
                    },
                    success: function(data) {
                        response(data.completions);
                    },
                });
            },
            minLength: 2,
            //open: function(e, ui) {
            // drill into the menu and wrap the term and the completions
            // in spans for styling.  Hopefully JQueryUI will start doing this
            // automatically in the future.
            //				var term = $("#"+id+"").val();
            //				var acData = $(this).data("uiAutocomplete");
            //				acData.menu.element.find("a").each(function() {
            //					var a = $(this);
            //					var completion = a.text();
            //					var pos = completion.indexOf(term);
            //					var txt = "";
            //					if(pos !== 0) {
            //						txt += "<span class='ui-autocomplete-completion'>" + completion.substr(0, pos) + "</span>";
            //					}
            //					txt += "<span class='ui-autocomplete-term'>" + term + "</span>";
            //					if(pos + term.length < completion.length) {
            //						txt += "<span class='ui-autocomplete-completion'>" + completion.substr(pos + term.length) + "</span>";
            //					}
            //					a.html(txt);
            //				});
            //			},
            select: function(event, ui) {
                $('#' + id + '')
                    .val(ui.item.value)
                    .closest('form')
                    .submit();
            },
        });
    }
});

// ===============================================================
// U.S. Government header accordion toggle
// ===============================================================
$(document).ready(function() {
    var e = $('.usa-closed');
    $('.usa-accordion-button').on('click', function(t) {
        $(e).hasClass('usa-closed')
            ? ($(this).attr('aria-expanded', 'true'),
              $(e).removeClass('usa-closed'),
              $(e).addClass('usa-open'))
            : ($(this).attr('aria-expanded', 'false'),
              $(e).addClass('usa-closed'),
              $(e).removeClass('usa-open'));
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJudHB3ZWItc2hhcmVkLW1pbmltYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIE5UUCA9IHtcbiAgICBwcmludHBhZ2U6ICcjcHJpbnR0aGlzcGFnZScsXG4gICAgcmFBZ2VuY2llczogJyNyYUFnZW5jaWVzJyxcbiAgICBhY3R1YWxIb3N0bmFtZTogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgcHJvZHVjdGlvbkhvc3RuYW1lczogWydudHAnLCAnd3d3Lm50cCcsICdudHAubmllaHMubmloLmdvdicsICd3d3cubnRwLm5pZWhzLm5paC5nb3YnLCAndG9vbHMubmllaHMubmloLmdvdicsICdudHBzZWFyY2gnLCAnbnRwc2VhcmNoLm5pZWhzLm5paC5nb3YnLCAnZWRpdCddLFxuICAgIGRldkhvc3ROYW1lczogWydudHBkZXYnLCAnbnRwZGV2Lm5pZWhzLm5paC5nb3YnLCAnYXBwczJkZXYubmllaHMubmloLmdvdicsICd0b29sczJkZXYubmllaHMubmloLmdvdicsICdudHBzZWFyY2gtZGV2JywgJ250cHNlYXJjaC1kZXYubmllaHMubmloLmdvdicsICdlZGl0LWRldiddLFxuICAgIHRlc3RIb3N0TmFtZXM6IFsnbnRwdGVzdCcsICdudHB0ZXN0Lm5pZWhzLm5paC5nb3YnLCAnYXBwczJ0c3QubmllaHMubmloLmdvdicsICd0b29sczJ0c3QubmllaHMubmloLmdvdicsICdudHBzZWFyY2gtdGVzdCcsICdudHBzZWFyY2gtdGVzdC5uaWVocy5uaWguZ292JywgJ2VkaXQtdHN0J10sXG4gICAgZW52aXJvbm1lbnQ6ICdQcm9kJyxcbiAgICBQdWJsaWNTaXRlSG9zdE5hbWU6ICdodHRwczovL250cC5uaWVocy5uaWguZ292JyxcbiAgICBpc1Byb2R1Y3Rpb246IGZhbHNlXG59XG5cbi8vIGNoZWNrIHRvIHNlZSBpZiB3ZSdyZSBvbiBwcm9kdWN0aW9uXG5mb3IgKHZhciBpID0gMDsgaSA8IE5UUC5kZXZIb3N0TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoTlRQLmFjdHVhbEhvc3RuYW1lID09PSBOVFAuZGV2SG9zdE5hbWVzW2ldKSB7XG4gICAgICAgIE5UUC5lbnZpcm9ubWVudCA9ICdEZXYnXG4gICAgICAgIE5UUC5QdWJsaWNTaXRlSG9zdE5hbWUgPSAnaHR0cHM6Ly9udHBkZXYubmllaHMubmloLmdvdidcbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZm9yICh2YXIgaSA9IDA7IGkgPCBOVFAudGVzdEhvc3ROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChOVFAuYWN0dWFsSG9zdG5hbWUgPT09IE5UUC50ZXN0SG9zdE5hbWVzW2ldKSB7XG4gICAgICAgIE5UUC5lbnZpcm9ubWVudCA9ICdUZXN0J1xuICAgICAgICBOVFAuUHVibGljU2l0ZUhvc3ROYW1lID0gJ2h0dHBzOi8vbnRwdGVzdC5uaWVocy5uaWguZ292J1xuICAgICAgICBicmVhaztcbiAgICB9XG59XG5mb3IgKHZhciBpID0gMDsgaSA8IE5UUC5wcm9kdWN0aW9uSG9zdG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKE5UUC5hY3R1YWxIb3N0bmFtZSA9PT0gTlRQLnByb2R1Y3Rpb25Ib3N0bmFtZXNbaV0pIHtcbiAgICAgICAgTlRQLmVudmlyb25tZW50ID0gJ1Byb2QnXG4gICAgICAgIE5UUC5QdWJsaWNTaXRlSG9zdE5hbWUgPSAnaHR0cHM6Ly9udHAubmllaHMubmloLmdvdidcbiAgICAgICAgTlRQLmlzUHJvZHVjdGlvbiA9IHRydWVcbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG4vLyBwcmV2ZW50IGNyb3NzLWZyYW1lIHNjcmlwdGluZyBieSBmb3JjaW5nIHRoZSBkb2N1bWVudCB0byBiZSB0aGUgdG9wIC0gb25seSBmb3IgcHJvZHVjdGlvbiBpbnN0YW5jZVxuaWYgKHRvcCAhPSBzZWxmKSB0b3AubG9jYXRpb24gPSBzZWxmLmxvY2F0aW9uO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAvLyByZWdpc3RlciBwcmludCB0aGlzIHBhZ2UgZXZlbnQuXG4gICAgJChOVFAucHJpbnRwYWdlKS5hdHRyKCdocmVmJywgJyMnKS5jbGljayhmdW5jdGlvbiAoKSB7IHdpbmRvdy5wcmludCgpOyB9KTtcblxuICAgIC8vcmVnaXN0ZXIgcmVndWxhdG9yeSBhY3Rpb25zIGV2ZW50LlxuICAgICQoTlRQLnJhQWdlbmNpZXMpLmNoYW5nZShmdW5jdGlvbiAoKSB7IGxvY2F0aW9uLmhyZWYgPSBcIiNcIiArICQodGhpcykudmFsKCk7IH0pO1xufSk7XG5cbi8qICB0aGlzIHJlbW92ZXMgcGxhY2Vob2xkZXIgdGV4dCBiZWZvcmUgcHJpbnRpbmcgLSBBZGRlZCBieSBNYXJrIENvbGViYW5rIDUvOC8yMDE1IFxuY2FsbGVkIGluIGJvZHkgdGFnIG9uIGZvcm1zIDxib2R5IG9uYmVmb3JlcHJpbnQ9XCJyZW1vdmVQbGFjZWhvbGRlcigpXCI+ICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlcigpIHtcbiAgICAkKFwiaW5wdXRcIikucmVtb3ZlQXR0cihcInBsYWNlaG9sZGVyXCIpO1xuICAgICQoXCJ0ZXh0YXJlYVwiKS5yZW1vdmVBdHRyKFwicGxhY2Vob2xkZXJcIik7XG59XG5cbi8vYWRkcyBJRSBzdXBwb3J0IGZvciBpbmNsdWRlcygpIEpTIG1ldGhvZCAtIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvaW5jbHVkZXNcbmlmICghU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcykge1xuICAgIFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgIT09IC0xO1xuICAgIH07XG59XG5cbi8vZGVmaW5lIGV4dGVybmFsIGxpbmsgZGlzY2xhaW1lciB0aXRsZSBhdHRyaWJ1dGU7IHVzZWQgd2l0aGluIG50cC5mb290ZXIuanMgYW5kIG50cC5leHRlcm5hbC1saW5rcy5qc1xudmFyIG50cEV4dGVybmFsRGlzY2xhaW1lciA9ICdUaGlzIGxpbmsgaXMgdG8gYSBub24tTlRQIHdlYnNpdGUuIExpbmtzIGRvIG5vdCBjb25zdGl0dXRlIGVuZG9yc2VtZW50IGJ5IE5UUCBvZiB0aGUgbGlua2VkIHdlYnNpdGUuIFZpc2l0b3JzIHRvIHRoZSBsaW5rZWQgd2Vic2l0ZSB3aWxsIGJlIHN1YmplY3QgdG8gdGhlIHdlYnNpdGUgcHJpdmFjeSBwb2xpY2llcy4gVGhlc2UgcHJhY3RpY2VzIG1heSBiZSBkaWZmZXJlbnQgdGhhbiB0aG9zZSBvZiB0aGlzIE5UUCB3ZWJzaXRlLic7XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZvb3RlciAocmVxdWlyZXMgalF1ZXJ5LCBudHAuY29tbW9uLmpzLCAmIEZvdW5kYXRpb24gTWVkaWFRdWVyeSlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblxuXHRmdW5jdGlvbiBmb290ZXJNb2JpbGUoKSB7XG5cdFx0JCgnLmxpbmstY2F0ZWdvcnkgdWwnKS5oaWRlKCk7XG5cdFx0JCgnLmxpbmstY2F0ZWdvcnkgaDUnKS51bmJpbmQoJ2NsaWNrIGtleXVwJykuYXR0cihcInRhYmluZGV4XCIsIFwiMFwiKS5vbih7XG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykubmV4dCgndWwnKS5zbGlkZVRvZ2dsZSgpO1xuXHRcdFx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdmb290ZXItbmF2LWFjdGl2ZScpO1xuXHRcdFx0fSxcblx0XHRcdGtleXVwOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZihldmVudC5rZXlDb2RlID09IDEzKXtcblx0XHRcdFx0XHQkKHRoaXMpLmNsaWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblx0XHR9KTtcblx0fVx0XG5cdGZ1bmN0aW9uIGZvb3RlckRlc2t0b3AoKSB7XG5cdFx0JCgnLmxpbmstY2F0ZWdvcnkgaDUnKS5yZW1vdmVBdHRyKFwidGFiaW5kZXhcIikub2ZmKCdjbGljayBrZXl1cCcpO1xuXHRcdCQoJy5saW5rLWNhdGVnb3J5IHVsJykuc2hvdygpO1xuXHR9XG5cdFxuXHQvL3RyaWdnZXIgYXQgYnJlYWtwb2ludFxuXHRvbkZvb3Rlck1vYmlsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChGb3VuZGF0aW9uLk1lZGlhUXVlcnkuaXMoJ3NtYWxsIG9ubHknKSkge1xuXHRcdFx0Zm9vdGVyTW9iaWxlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvb3RlckRlc2t0b3AoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vb24gcGFnZSBsb2FkIGFuZCBtZWRpYSBxdWVyeSBjaGFuZ2UsIGluaXRpYWxpemUgb25Gb290ZXJNb2JpbGUoKTtcblx0JCh3aW5kb3cpLm9uKCdsb2FkIGNoYW5nZWQuemYubWVkaWFxdWVyeScsIG9uRm9vdGVyTW9iaWxlKTtcblx0XG5cdC8vYWRkIHRpdGxlIGF0dHJpYnV0ZSB0byBleHRlcm5hbCBsaW5rcyBpbiB0aGUgZm9vdGVyXG5cdCQoJyNmb290ZXIgYS5leHRlcm5hbCwgLmZvb3Rlci1sb2dvcyBhJykuYXR0cigndGl0bGUnLCBudHBFeHRlcm5hbERpc2NsYWltZXIpO1xuXG59KTtcblwidXNlIHN0cmljdFwiO1xuLypqc2xpbnQgYnJvd3NlcjogdHJ1ZSovXG4vKmdsb2JhbCAgJCovXG4vLyBKYXZhc2NyaXB0IGZvciBUaHVuZGVyc3RvbmUgc2VhcmNoXG4kKGZ1bmN0aW9uKCkge1xuXHQvLyBkZWZhdWx0IGlkIHRvIHF1ZXJ5XG5cdHZhciBpZHMgPSAkKCdbaWRePXF1ZXJ5XScpLmZpbHRlcihcIi5xdWVyeUF1dG9jb21wbGV0ZVwiKTtcdFxuICAgIC8vIGFkZCBhdXRvY29tcGxldGVcblx0Zm9yKHZhciBpID0wO2k8aWRzLmxlbmd0aCA7aSsrKVxuXHR7XG5cdFx0dmFyIGlkID0kKCdbaWRePXF1ZXJ5XScpLmZpbHRlcihcIi5xdWVyeUF1dG9jb21wbGV0ZVwiKVtpXS5pZDtcblx0XHRhdXRvQ29tcGxldGUoaWQpO1xuXHR9XG5cdGZ1bmN0aW9uIGF1dG9Db21wbGV0ZShpZClcblx0e1xuXHRcdCQoXCIjXCIgKyBpZCArIFwiLnF1ZXJ5QXV0b2NvbXBsZXRlXCIpLmF1dG9jb21wbGV0ZSh7XG5cdFx0XHRzb3VyY2U6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSAkKFwiI1wiK2lkK1wiXCIpLmNsb3Nlc3QoXCJmb3JtXCIpLmF0dHIoXCJhY3Rpb25cIik7XG5cdFx0XHRcdHZhciB1cmwgPSBcIi8vc2Vlay5uaWVocy5uaWguZ292L3RleGlzL2F1dG9jb21wbGV0ZS5qc29uXCI7XG5cdFx0XHRcdHZhciBwcm9maWxlID0gXCJudHBcIjtcblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHRkYXRhVHlwZTogXCJqc29ucFwiLFxuXHRcdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdHByOiBwcm9maWxlLFxuXHRcdFx0XHRcdFx0dGVybTogcmVxdWVzdC50ZXJtXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZShkYXRhLmNvbXBsZXRpb25zKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSxcblx0XHRcdG1pbkxlbmd0aDogMixcblx0XHRcdC8vb3BlbjogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0Ly8gZHJpbGwgaW50byB0aGUgbWVudSBhbmQgd3JhcCB0aGUgdGVybSBhbmQgdGhlIGNvbXBsZXRpb25zXG5cdFx0XHRcdC8vIGluIHNwYW5zIGZvciBzdHlsaW5nLiAgSG9wZWZ1bGx5IEpRdWVyeVVJIHdpbGwgc3RhcnQgZG9pbmcgdGhpc1xuXHRcdFx0XHQvLyBhdXRvbWF0aWNhbGx5IGluIHRoZSBmdXR1cmUuXG4vL1x0XHRcdFx0dmFyIHRlcm0gPSAkKFwiI1wiK2lkK1wiXCIpLnZhbCgpO1xuLy9cdFx0XHRcdHZhciBhY0RhdGEgPSAkKHRoaXMpLmRhdGEoXCJ1aUF1dG9jb21wbGV0ZVwiKTtcbi8vXHRcdFx0XHRhY0RhdGEubWVudS5lbGVtZW50LmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4vL1x0XHRcdFx0XHR2YXIgYSA9ICQodGhpcyk7XG4vL1x0XHRcdFx0XHR2YXIgY29tcGxldGlvbiA9IGEudGV4dCgpO1xuLy9cdFx0XHRcdFx0dmFyIHBvcyA9IGNvbXBsZXRpb24uaW5kZXhPZih0ZXJtKTtcbi8vXHRcdFx0XHRcdHZhciB0eHQgPSBcIlwiO1xuLy9cdFx0XHRcdFx0aWYocG9zICE9PSAwKSB7XG4vL1x0XHRcdFx0XHRcdHR4dCArPSBcIjxzcGFuIGNsYXNzPSd1aS1hdXRvY29tcGxldGUtY29tcGxldGlvbic+XCIgKyBjb21wbGV0aW9uLnN1YnN0cigwLCBwb3MpICsgXCI8L3NwYW4+XCI7XG4vL1x0XHRcdFx0XHR9XG4vL1x0XHRcdFx0XHR0eHQgKz0gXCI8c3BhbiBjbGFzcz0ndWktYXV0b2NvbXBsZXRlLXRlcm0nPlwiICsgdGVybSArIFwiPC9zcGFuPlwiO1xuLy9cdFx0XHRcdFx0aWYocG9zICsgdGVybS5sZW5ndGggPCBjb21wbGV0aW9uLmxlbmd0aCkge1xuLy9cdFx0XHRcdFx0XHR0eHQgKz0gXCI8c3BhbiBjbGFzcz0ndWktYXV0b2NvbXBsZXRlLWNvbXBsZXRpb24nPlwiICsgY29tcGxldGlvbi5zdWJzdHIocG9zICsgdGVybS5sZW5ndGgpICsgXCI8L3NwYW4+XCI7XG4vL1x0XHRcdFx0XHR9XG4vL1x0XHRcdFx0XHRhLmh0bWwodHh0KTtcbi8vXHRcdFx0XHR9KTtcbi8vXHRcdFx0fSxcblx0XHRcdHNlbGVjdDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0XHRcdCQoXCIjXCIraWQrXCJcIikudmFsKHVpLml0ZW0udmFsdWUpLmNsb3Nlc3QoXCJmb3JtXCIpLnN1Ym1pdCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59KTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVLlMuIEdvdmVybm1lbnQgaGVhZGVyIGFjY29yZGlvbiB0b2dnbGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGUgPSAkKFwiLnVzYS1jbG9zZWRcIik7XG4gICAgJChcIi51c2EtYWNjb3JkaW9uLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgJChlKS5oYXNDbGFzcyhcInVzYS1jbG9zZWRcIikgPyAoJCh0aGlzKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIiksICQoZSkucmVtb3ZlQ2xhc3MoXCJ1c2EtY2xvc2VkXCIpLCAkKGUpLmFkZENsYXNzKFwidXNhLW9wZW5cIikpIDogKCQodGhpcykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKSwgJChlKS5hZGRDbGFzcyhcInVzYS1jbG9zZWRcIiksICQoZSkucmVtb3ZlQ2xhc3MoXCJ1c2Etb3BlblwiKSlcbiAgICB9KVxufSk7Il0sImZpbGUiOiJudHB3ZWItc2hhcmVkLW1pbmltYWwuanMifQ==
