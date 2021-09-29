import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Spin } from 'antd';
import { GithubLoginButton } from 'react-social-login-buttons';
import { IOrganizationEntity } from '@hacksquad/shared/src';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { isServerSide } from '../shared/utils';
import { api, AUTH_URL } from '../shared/api';
import { getUser } from '../shared/auth.service';

export default function AcceptInvite() {
  const router = useRouter();
  const [squad, setSquad] = useState<IOrganizationEntity>();

  useEffect(() => {
    if (!isServerSide() && router.query.token) {
      loadInviteSquad(router.query.token as string);
    }
  }, [router]);

  useEffect(() => {
    if (!isServerSide()) {
      const user = getUser();

      if (user?.organizationId) {
        router.push('/leaderboard');
      }
    }
  }, []);

  async function loadInviteSquad(token: string) {
    const response = await api.get(`/v1/organizations/token/${token}`);
    setSquad(response);
  }

  if (!squad) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <NavigationBar />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '100px 0',
          flexDirection: 'column',
        }}>
        <Avatar size={100} src={squad?.logo}>
          {squad?.name[0]}
        </Avatar>

        <div className="title-grey-400" style={{ marginBottom: -10, marginTop: 30 }}>
          Accept your hacksquad invite
        </div>
        <h1 className="hero-heading-white" style={{ marginBottom: 70 }}>
          Join
          <span style={{ color: '#5ec6e8' }}> {squad?.name}</span>
        </h1>
        <GithubLoginButton
          style={{ maxWidth: 300 }}
          onClick={() => window.open(`${AUTH_URL}?token=${router?.query?.token}`)}
        />
      </div>

      <Footer />
    </>
  );
}
