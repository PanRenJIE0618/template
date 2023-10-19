define(["exports","./arrayFill-4513d7ad","./buildModuleUrl-8958744c","./Cartographic-3309dd0d","./ComponentDatatype-c140a87d","./when-b60132fc","./Check-7b2a090c","./Cartesian2-47311507","./GeometryAttribute-06a41648","./GeometryAttributes-252e9929","./GeometryOffsetAttribute-fbeb6f1a","./IndexDatatype-8a5eead4","./Math-119be1a3","./FeatureDetection-806b12f0"],(function(i,t,e,a,n,r,o,s,u,m,f,d,l,c){"use strict";var C=new a.Cartesian3(1,1,1),_=Math.cos,h=Math.sin;function p(i){i=r.defaultValue(i,r.defaultValue.EMPTY_OBJECT);var t=r.defaultValue(i.radii,C),e=r.defaultValue(i.innerRadii,t),n=r.defaultValue(i.minimumClock,0),o=r.defaultValue(i.maximumClock,l.CesiumMath.TWO_PI),s=r.defaultValue(i.minimumCone,0),u=r.defaultValue(i.maximumCone,l.CesiumMath.PI),m=Math.round(r.defaultValue(i.stackPartitions,10)),f=Math.round(r.defaultValue(i.slicePartitions,8)),d=Math.round(r.defaultValue(i.subdivisions,128));this._radii=a.Cartesian3.clone(t),this._innerRadii=a.Cartesian3.clone(e),this._minimumClock=n,this._maximumClock=o,this._minimumCone=s,this._maximumCone=u,this._stackPartitions=m,this._slicePartitions=f,this._subdivisions=d,this._offsetAttribute=i.offsetAttribute,this._workerName="createEllipsoidOutlineGeometry"}p.packedLength=2*a.Cartesian3.packedLength+8,p.pack=function(i,t,e){return e=r.defaultValue(e,0),a.Cartesian3.pack(i._radii,t,e),e+=a.Cartesian3.packedLength,a.Cartesian3.pack(i._innerRadii,t,e),e+=a.Cartesian3.packedLength,t[e++]=i._minimumClock,t[e++]=i._maximumClock,t[e++]=i._minimumCone,t[e++]=i._maximumCone,t[e++]=i._stackPartitions,t[e++]=i._slicePartitions,t[e++]=i._subdivisions,t[e]=r.defaultValue(i._offsetAttribute,-1),t};var y=new a.Cartesian3,v=new a.Cartesian3,b={radii:y,innerRadii:v,minimumClock:void 0,maximumClock:void 0,minimumCone:void 0,maximumCone:void 0,stackPartitions:void 0,slicePartitions:void 0,subdivisions:void 0,offsetAttribute:void 0};p.unpack=function(i,t,e){t=r.defaultValue(t,0);var n=a.Cartesian3.unpack(i,t,y);t+=a.Cartesian3.packedLength;var o=a.Cartesian3.unpack(i,t,v);t+=a.Cartesian3.packedLength;var s=i[t++],u=i[t++],m=i[t++],f=i[t++],d=i[t++],l=i[t++],c=i[t++],C=i[t];return r.defined(e)?(e._radii=a.Cartesian3.clone(n,e._radii),e._innerRadii=a.Cartesian3.clone(o,e._innerRadii),e._minimumClock=s,e._maximumClock=u,e._minimumCone=m,e._maximumCone=f,e._stackPartitions=d,e._slicePartitions=l,e._subdivisions=c,e._offsetAttribute=-1===C?void 0:C,e):(b.minimumClock=s,b.maximumClock=u,b.minimumCone=m,b.maximumCone=f,b.stackPartitions=d,b.slicePartitions=l,b.subdivisions=c,b.offsetAttribute=-1===C?void 0:C,new p(b))},p.createGeometry=function(i){var a=i._radii;if(!(a.x<=0||a.y<=0||a.z<=0)){var o=i._innerRadii;if(!(o.x<=0||o.y<=0||o.z<=0)){var C=i._minimumClock,p=i._maximumClock,y=i._minimumCone,v=i._maximumCone,b=i._subdivisions,k=s.Ellipsoid.fromCartesian3(a),A=i._slicePartitions+1,x=i._stackPartitions+1;(A=Math.round(A*Math.abs(p-C)/l.CesiumMath.TWO_PI))<2&&(A=2),(x=Math.round(x*Math.abs(v-y)/l.CesiumMath.PI))<2&&(x=2);var P=0,M=1,w=o.x!==a.x||o.y!==a.y||o.z!==a.z,g=!1,V=!1;w&&(M=2,y>0&&(g=!0,P+=A),v<Math.PI&&(V=!0,P+=A));var G,E,D,O,I=b*M*(x+A),z=new Float64Array(3*I),L=2*(I+P-(A+x)*M),T=d.IndexDatatype.createTypedArray(I,L),R=0,N=new Array(x),B=new Array(x);for(G=0;G<x;G++)O=y+G*(v-y)/(x-1),N[G]=h(O),B[G]=_(O);var F=new Array(b),S=new Array(b);for(G=0;G<b;G++)D=C+G*(p-C)/(b-1),F[G]=h(D),S[G]=_(D);for(G=0;G<x;G++)for(E=0;E<b;E++)z[R++]=a.x*N[G]*S[E],z[R++]=a.y*N[G]*F[E],z[R++]=a.z*B[G];if(w)for(G=0;G<x;G++)for(E=0;E<b;E++)z[R++]=o.x*N[G]*S[E],z[R++]=o.y*N[G]*F[E],z[R++]=o.z*B[G];for(N.length=b,B.length=b,G=0;G<b;G++)O=y+G*(v-y)/(b-1),N[G]=h(O),B[G]=_(O);for(F.length=A,S.length=A,G=0;G<A;G++)D=C+G*(p-C)/(A-1),F[G]=h(D),S[G]=_(D);for(G=0;G<b;G++)for(E=0;E<A;E++)z[R++]=a.x*N[G]*S[E],z[R++]=a.y*N[G]*F[E],z[R++]=a.z*B[G];if(w)for(G=0;G<b;G++)for(E=0;E<A;E++)z[R++]=o.x*N[G]*S[E],z[R++]=o.y*N[G]*F[E],z[R++]=o.z*B[G];for(R=0,G=0;G<x*M;G++){var U=G*b;for(E=0;E<b-1;E++)T[R++]=U+E,T[R++]=U+E+1}var W=x*b*M;for(G=0;G<A;G++)for(E=0;E<b-1;E++)T[R++]=W+G+E*A,T[R++]=W+G+(E+1)*A;if(w)for(W=x*b*M+A*b,G=0;G<A;G++)for(E=0;E<b-1;E++)T[R++]=W+G+E*A,T[R++]=W+G+(E+1)*A;if(w){var Y=x*b*M,J=Y+b*A;if(g)for(G=0;G<A;G++)T[R++]=Y+G,T[R++]=J+G;if(V)for(Y+=b*A-A,J+=b*A-A,G=0;G<A;G++)T[R++]=Y+G,T[R++]=J+G}var j=new m.GeometryAttributes({position:new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:z})});if(r.defined(i._offsetAttribute)){var q=z.length,H=new Uint8Array(q/3),K=i._offsetAttribute===f.GeometryOffsetAttribute.NONE?0:1;t.arrayFill(H,K),j.applyOffset=new u.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:H})}return new u.Geometry({attributes:j,indices:T,primitiveType:c.PrimitiveType.LINES,boundingSphere:e.BoundingSphere.fromEllipsoid(k),offsetAttribute:i._offsetAttribute})}}},i.EllipsoidOutlineGeometry=p}));
