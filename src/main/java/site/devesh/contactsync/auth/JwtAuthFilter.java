package site.devesh.contactsync.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import site.devesh.contactsync.services.JwtService;
import site.devesh.contactsync.services.UserDetailsServiceImpl;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter (JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try{
            String authHeader = request.getHeader("Authorization");
            String username =null;
            String token = null;

            if(authHeader != null && authHeader.startsWith("Bearer ") ) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }
            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if(jwtService.validateToken(token,userDetails)){
                    UsernamePasswordAuthenticationToken usernamePassToken = new UsernamePasswordAuthenticationToken(userDetails,null, userDetails.getAuthorities());
                    usernamePassToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePassToken);
                }

            }
        }catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired, Please login again.");
            return;
        }catch (MalformedJwtException |
                SignatureException e ){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid Token");
            return;
        }

        filterChain.doFilter(request,response);
    }

}
