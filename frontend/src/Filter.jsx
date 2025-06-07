import { useState, useEffect } from 'react';
import './assets/css/main.css';
import api from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

function Filter() {
  const navigate = useNavigate();
  const params = useParams();

  const [sourceData, setSourceData] = useState({
    city: [],
    state: [],
    course: [],
    stream: [],
    accepted_exam: [],
    program_type: [
      { name: 'Undergraduate', slug: 'undergraduate' },
      { name: 'Graduate', slug: 'graduate' },
      { name: 'Distance Learning', slug: 'distance-learning' },
      { name: 'Online', slug: 'online' },
    ],
    college_type: [
      { name: 'Public', slug: 'public' },
      { name: 'Private', slug: 'private' },
    ],
  });

  const [filters, setFilters] = useState({
    city: [],
    state: [],
    course: [],
    stream: [],
    accepted_exam: [],
    program_type: [],
    college_type: [],
  });

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/');
      const data = {
        ...response.data,
        city: (response.data.city || []).map(item => ({ ...item, category: 'city' })),
        state: (response.data.state || []).map(item => ({ ...item, category: 'state' })),
        course: (response.data.course || []).map(item => ({ ...item, category: 'course' })),
        stream: (response.data.stream || []).map(item => ({ ...item, category: 'stream' })),
        accepted_exam: (response.data.accepted_exam || []).map(item => ({ ...item, category: 'exam' })),
      };
      setSourceData(prev => ({ ...prev, ...data }));
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load filter options. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getUniversities = async (slugCategory) => {
    try {
      const filter = {};
      if (slugCategory) {
        filter.category = slugCategory;
      }
      if (params.slug) {
        filter.slug = params.slug;
      }

      setLoading(true);
      const response = await api.get('/universities', { params: filter });
      setUniversities(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError('Failed to load universities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (params.slug) {
      const matchedCategory = Object.keys(sourceData).find(key =>
        Array.isArray(sourceData[key]) &&
        sourceData[key].some(item => item.slug === params.slug)
      );

      if (matchedCategory) {
        setCategory(matchedCategory);
        console.log('Matched category:', matchedCategory);
        getUniversities(matchedCategory);
      } else {
        console.log('No matching slug found');
        setCategory('');
        getUniversities(null);
      }
    } else {
      getUniversities(null);
    }
  }, [params.slug, sourceData]);

  const handleFilterChange = (categoryKey, value, slug) => {
    setCategory(categoryKey);
    if (slug) {
      navigate(`/${slug}`);
    }
  };

  const FilterSection = ({ title, items, category }) => (
    <div className="filter_list">
      <h2>{title}</h2>
      <div className="list">
        <ul>
          {items?.length > 0 ? (
            items.map((item, index) => (
              <li key={`${category}-${item.name}-${index}`}>
                <input
                  id={`${category}-${item.name}-${index}`}
                  type="checkbox"
                  checked={filters[category].includes(item.name)}
                  onChange={() => handleFilterChange(category, item.name, item.slug)}
                />
                <label htmlFor={`${category}-${item.name}-${index}`}>
                  {item.name}
                </label>
              </li>
            ))
          ) : (
            <li>No {title.toLowerCase()} available</li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="head">
        <h4>University Filter</h4>
      </div>
      {loading ? (
        <div>Loading filter options...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="main_section">
          <div className="left">
            <FilterSection title="City" items={sourceData.city} category="city" />
            <FilterSection title="State" items={sourceData.state} category="state" />
            <FilterSection title="Course" items={sourceData.course} category="course" />
            <FilterSection title="Stream" items={sourceData.stream} category="stream" />
            <FilterSection title="Accepted Exam" items={sourceData.accepted_exam} category="accepted_exam" />
            {/* <FilterSection title="Program Type" items={sourceData.program_type} category="program_type" />
            <FilterSection title="College Type" items={sourceData.college_type} category="college_type" /> */}
          </div>
          <div className="right">
            {universities.length > 0 ? (
              <div className="results_grid">
                {universities.map((uni, index) => (
                  <div key={index} className="result_card">
                    <h3>{uni.name}</h3>
                    <p>City: {uni.city?.name}</p>
                    <p>State: {uni.state?.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No universities match the selected filters</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
