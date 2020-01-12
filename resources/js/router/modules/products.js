import Layout from '@/layout';

const productsRoutes = {
  path: '/products',
  component: Layout,
  redirect: '/products/index',
  name: 'Products',
  meta: {
    title: 'products',
    icon: 'layout',
    permissions: ['view menu element ui'],
  },
  children: [
    {
      path: 'products',
      name: 'products',
      component: () => import('@/views/products/index'),
      meta: { title: 'products', icon: 'form' },
    },
    {
      path: 'categories',
      component: () => import('@/views/categories/index'),
      name: 'Icons',
      meta: { title: 'categories', icon: 'icon', noCache: true },
    },
  ],
};

export default productsRoutes;
