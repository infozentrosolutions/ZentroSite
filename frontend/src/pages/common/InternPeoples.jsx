import { Helmet } from 'react-helmet-async';
import InternPeopleHub from '../../components/InternPeopleHub';

const InternPeoples = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] px-4 sm:px-6 lg:px-8 pt-24 pb-20">
            <Helmet>
                <title>Intern Peoples | Zentro Solutions</title>
                <meta name="robots" content="index, follow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <InternPeopleHub />
            </div>
        </div>
    );
};

export default InternPeoples;