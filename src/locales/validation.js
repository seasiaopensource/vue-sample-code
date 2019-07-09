import _ from 'lodash'
import i18n from './i18n'

export default _.mapValues(i18n.messages, (lang) => {
  return {
    messages: {
      'contain_lower': (n) => n + (lang && lang.validation && lang.validation['contain_lower']),
      'contain_capital': (n) => n + (lang && lang.validation && lang.validation['contain_capital']),
      'contain_number': (n) => n + (lang && lang.validation && lang.validation['contain_number']),
      'contain_special': (n) => n + (lang && lang.validation && lang.validation['contain_special']),
      'not_contain': (field, params) => {
        if (_.isArray(params)) {
          params = _.join(params, '", "')
        }
        return field + (lang && lang.validation && lang.validation['not_contain'].pre) + params + (lang && lang.validation && lang.validation['not_contain'].post)
      },
      confirmed: function (e, n) {
        return e + (lang && lang.validation && lang.validation.confirmed)
      },
      ext: (field) => {
        // console.log('field======', field)
        if (field.search('(PDF)')) {
          var fieldText = field.replace('(PDF)', '')
          // console.log('fieldText', fieldText)
          return (lang && lang.validation && lang.validation.ext_pdf.pre) + ` ${fieldText} ` + (lang && lang.validation && lang.validation.ext_pdf.post)
        }
        return `${field} ` + (lang && lang.validation && lang.validation.ext)
      },
      decimal: (field, [decimals = '*'] = []) => {
        return lang.validation['decimal'].pre + ` ${field} ` + lang.validation['decimal'].mid + ` ${!decimals || decimals === '*' ? '' : decimals} ` + lang.validation['decimal'].post
      }
    },
    custom: {
      companyRights: {
        required: (lang && lang.validation && lang.validation.companyRights)
      },
      acceptAgb: {
        required: (lang && lang.validation && lang.validation.acceptAgb)
      },
      dob: {
        date_format: (lang && lang.validation && lang.validation.dob)
      },
      taxNumber: {
        taxOrVatRequired: (lang && lang.validation && lang.validation.taxOrVatRequired)
      },
      vatId: {
        taxOrVatRequired: (lang && lang.validation && lang.validation.taxOrVatRequired)
      },
      paypalPayment: {
        required: (
          lang &&
          lang.shopmanager &&
          lang.shopmanager.payment &&
          lang.shopmanager.payment.paymentErrorMsg
        )
      },
      'shipping-type': {
        required: (
          lang &&
          lang.shopmanager &&
          lang.shopmanager.shipping &&
          lang.shopmanager.shipping.shippingErrorMsg
        )
      }
    }
  }
})

// export default {
//   en: {
//
//   },
//   de: {
//     messages: {
//       'contain_lower': (n) => n + ,
//       'contain_capital': (n) => n + ,
//       'contain_number': (n) => n + ,
//       'contain_special': (n) => n + ,
//       'not_contain': (field, params) => {
//         if (_.isArray(params)) {
//           var allParams = _.join(params, '", "')
//           return field +  + allParams +
//         } else {
//           return field + ' darf "' + params + '" nicht enthalten.'
//         }
//       },
//       confirmed: function (e, n) {
//         return e + ' stimmt nicht überein.'
//       }
//     },
//     custom: {
//       [de.registerForm.companyRights]: {
//         required: 'Sie müssen die Registrierungsberechtigung für dieses Unternehmen haben.'
//       },
//       [de.registerForm.acceptAgb]: {
//         required: 'Sie müssen die Datenschutzbestimmungen und AGBs akzeptieren.'
//       },
//       dob: {
//         date_format: 'Bitte wählen Sie ein gültiges Datum aus.'
//       }
//     }
//   }
// }
