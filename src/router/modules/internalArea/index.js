import { getCurrentProfile } from "@/etc/oidcUserManager";
import {
  getCategoryFromGlobalId,
  GroupProfileCategoryId
} from "@/etc/userClaims";

const HomePage = () =>
  import(/* webpackChunkName: "home" */ "@/components/pages/Home/HomePage");
const HomePageTemplate = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/templates/Home/HomePageTemplate"
  );

// MyPurchases(Customer orders) sections
const MyPurchasesPage = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/pages/MyPurchases/MyPurchasesPage"
  );
const MyPurchasesOrders = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/pages/MyPurchases/OrdersOverviewPage"
  );
const MyPurchasesOrdersContent = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/organisms/MyPurchases/OrdersOverview"
  );
const MyPurchasesOrderDetail = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/organisms/MyPurchases/OrderDetail"
  );
const MyPurchasesDashboard = () =>
  import(
    /* webpackChunkName: "home" */ "@/components/organisms/MyPurchases/Dashboard"
  );

const shopSetupPage = () =>
  import(
    /* webpackChunkName: "shop-setup" */ "@/components/pages/Shop/Setup/ShopSetupPage"
  );
const shopSetupGeneral = () =>
  import(
    /* webpackChunkName: "shop-setup" */ "@/components/organisms/Forms/ShopSetupGeneralForm"
  );
const shopSetupContacts = () =>
  import(
    /* webpackChunkName: "shop-setup" */ "@/components/organisms/Forms/ShopSetupContactsForm"
  );
const shopSetupLegal = () =>
  import(
    /* webpackChunkName: "shop-setup" */ "@/components/organisms/Forms/ShopSetupLegalForm"
  );

const Pages = () =>
  import(/* webpackChunkName: "profile" */ "@/components/pages/Pages");
const ProfilePage = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/pages/Profile/ProfilePage"
  );
const ProfileSinglePage = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/pages/Profile/ProfileSinglePage"
  );
const ProfileOverview = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/organisms/Profile/ProfileOverview"
  );
const ProfileInfo = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/organisms/Profile/ProfileInfo"
  );
const ProfileNetwork = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/organisms/Profile/ProfileNetwork"
  );
const Employees = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/organisms/Profile/Employees"
  );
const ProfileCompanies = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/organisms/Profile/ProfileCompanies"
  );
const Groups = () =>
  import(/* webpackChunkName: "profile" */ "@/components/pages/Groups/Groups");
const GroupsOverview = () =>
  import(
    /* webpackChunkName: "profile" */ "@/components/pages/Groups/GroupsOverview"
  );

// Access Denied Page
import AccessDeniedPage from "@/components/pages/AccessDeniedPage";

const guardProfileRoutes = async (to, from, next) => {
  var profileId = to.params.profileId;
  if (getCategoryFromGlobalId(profileId) === GroupProfileCategoryId) {
    next({
      name: "groupOverview",
      params: { groupId: profileId },
      replace: true
    });
  } else {
    next();
  }
};

export default {
  path: "/",
  name: "internalArea",
  component: Pages,
  redirect: { name: "home" },
  children: [
    {
      path: "",
      name: "homeTemplate",
      component: HomePageTemplate,
      redirect: { name: "home" },
      children: [
        {
          path: "/",
          props: true,
          name: "home",
          component: HomePage
        }
      ]
    },
    {
      path: "profile/:profileId",
      name: "profilePage",
      props: route => ({
        query: route.query,
        profileId: route.params.profileId
      }),
      beforeEnter: async (to, from, next) => {
        if (to.name === "profilePage") {
          var profileId = to.params.profileId;
          if (!profileId) {
            profileId = await getCurrentProfile();
          }
          next({
            name: "profileOverview",
            params: { profileId },
            replace: true
          });
        } else {
          next();
        }
      },
      component: ProfilePage,
      children: _.map(
        [
          {
            path: "overview",
            name: "profileOverview",
            component: ProfileOverview,
            props: true
          },
          {
            path: "info",
            name: "profileInfo",
            component: ProfileInfo,
            props: true
          },
          {
            path: "network",
            name: "profileNetwork",
            component: ProfileNetwork,
            props: true
          },
          {
            path: "employees",
            name: "employees",
            component: Employees,
            props: true
          },
          {
            path: "companies",
            name: "companies",
            component: ProfileCompanies,
            props: route => ({
              query: route.query,
              profileId: route.params.profileId
            })
          },
          {
            path: "legal-notice",
            name: "profileImperssion",
            component: ProfileImpressum,
            props: true
          },
          {
            path: "groups",
            name: "groups",
            component: Groups,
            redirect: { name: "groupsOverview" },
            props: true,
            children: [
              {
                path: "",
                name: "groupsOverview",
                props: true,
                component: GroupsOverview
              }
            ]
          }
        ],
        child => ({ ...child, beforeEnter: guardProfileRoutes })
      )
    },
    {
      path: "shopsetup",
      name: "shopSetupPage",
      component: shopSetupPage,
      redirect: { name: "shopSetupGeneral" },
      children: [
        {
          path: "general",
          name: "shopSetupGeneral",
          component: shopSetupGeneral
        },
        {
          path: "contacts",
          name: "shopSetupContacts",
          component: shopSetupContacts
        },
        {
          path: "legal",
          name: "shopSetupLegal",
          component: shopSetupLegal
        }
      ]
    },
    {
      path: "my-purchases",
      name: "myPurchases",
      component: MyPurchasesPage,
      props: true,
      redirect: { name: "myPurchasesDashboard" },
      children: [
        {
          path: "dashboard",
          name: "myPurchasesDashboard",
          component: MyPurchasesDashboard,
          props: true
        },
        {
          path: "view/shop/:shopId/order/:orderId",
          name: "purchaseOrderDetailPage",
          component: MyPurchasesOrderDetail,
          props: true
        },
        {
          path: "orders",
          name: "myPurchasesOrders",
          redirect: { name: "myPurchasesOrdersAll" },
          component: MyPurchasesOrders,
          props: true,
          children: [
            {
              path: "all",
              name: "myPurchasesOrdersAll",
              component: MyPurchasesOrdersContent,
              props: route => ({
                query: route.query
              })
            },
            {
              path: "new-orders",
              name: "myPurchasesOrdersNewOrders",
              component: MyPurchasesOrdersContent,
              props: route => ({
                query: route.query
              })
            },
            {
              path: "in-progress",
              name: "myPurchasesOrdersInProgress",
              component: MyPurchasesOrdersContent,
              props: route => ({
                query: route.query
              })
            },
            {
              path: "shipped",
              name: "myPurchasesOrdersShipped",
              component: MyPurchasesOrdersContent,
              props: route => ({
                query: route.query
              })
            },
            {
              path: "completed",
              name: "myPurchasesOrdersCompleted",
              component: MyPurchasesOrdersContent,
              props: route => ({
                query: route.query
              })
            }
          ]
        }
      ]
    },
    {
      path: "access-denied",
      name: "AccessDeniedPage",
      component: AccessDeniedPage
    }
  ]
};
