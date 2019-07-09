import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards'

const AccountActivationPath = portalConfig.paths.accountActivation

const namespaced = true

const standardValues = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  companyRights: false,
  agb: false,
  completed: false,
  isLoadingPersonalRegistration: false,
  isLoadingCompanyRegistration: false
}

const initialState = () => {
  return {}
}

const getters = {}

const mutations = {}

const actions = {

  async submit ({ commit, state, rootGetters, dispatch }, payload) {
    if (payload && payload.type === 'person') {
      await dispatch('_sendPerson')
    }
    if (payload && payload.type === 'company') {
      await dispatch('_sendCompany')
    }
  },

  _sendPerson: createStandardAjax({
    isLoadingState: 'isLoadingPersonalRegistration',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Registration',
      operationId: 'ApiV1RegistrationPersonal_accountPost'
    },
    params: {
      FirstName: 'firstName',
      LastName: 'lastName',
      Email: 'email',
      Password: 'password',
      AcceptedTermsAndConditions: 'agb',
      DomainRegisteredOn: {plain: portalConfig.paths.domain},
      AccountActivationUrl: {plain: portalConfig.paths.protocol + portalConfig.paths.domain + '/' + AccountActivationPath + '{code}?language={language}'}
    },
    onSuccess: ({commit}) => commit('updateCompleted', true)
  }),

  _sendCompany: createStandardAjax({
    isLoadingState: 'isLoadingCompanyRegistration',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Registration',
      operationId: 'ApiV1RegistrationCompany_accountPost'
    },
    params: {
      CompanyName: 'companyName',
      Email: 'email',
      Password: 'password',
      'ContactPerson.FirstName': 'firstName',
      'ContactPerson.LastName': 'lastName',
      'ContactPerson.AcceptedTermsAndConditions': 'companyRights',
      'AcceptedTermsAndConditions': 'agb',
      DomainRegisteredOn: {plain: portalConfig.paths.domain},
      AccountActivationUrl: {plain: portalConfig.paths.protocol + portalConfig.paths.domain + '/' + AccountActivationPath + '{code}?language={language}'}
    },
    onSuccess: ({commit}) => commit('updateCompleted', true)
  })
}

export default createStandardStore(
  standardValues, {
    namespaced,
    state: initialState,
    getters,
    actions,
    mutations
  }
)
